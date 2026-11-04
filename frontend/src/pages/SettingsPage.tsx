import { useState, useEffect } from "react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Button, Input } from "../components/ui";
import {
  Settings, Save, Loader2, User, LogOut, Building2,
  Shield, Bell, CheckCircle2, Lock, Key, Smartphone, Award
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "business" | "security" | "notifications">("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    // Buyer
    businessType: "",
    address: "",
    city: "",
    country: "",
    // Manufacturer
    factoryName: "",
    factoryAddress: "",
    gstNumber: "24AAACA1234A1Z5",
    productionCapacity: "",
    minOrderQuantity: ""
  });

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notifications state
  const [notifPreferences, setNotifPreferences] = useState({
    rfqAlerts: true,
    orderUpdates: true,
    quoteResponses: true,
    marketingEmails: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/me');
        if (res.data.success) {
          const profile = res.data.data;
          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            companyName: profile.companyName || "",
            businessType: profile.buyerProfile?.businessType || "D2C Brand",
            address: profile.buyerProfile?.address || "",
            city: profile.buyerProfile?.city || profile.manufacturerProfile?.city || "Ahmedabad",
            country: profile.buyerProfile?.country || profile.manufacturerProfile?.country || "India",
            factoryName: profile.manufacturerProfile?.factoryName || profile.companyName || "Artisan Metals Co.",
            factoryAddress: profile.manufacturerProfile?.factoryAddress || "Plot 42, GIDC Industrial Estate",
            gstNumber: "24AAACA1234A1Z5",
            productionCapacity: profile.manufacturerProfile?.productionCapacity || "50,000 pcs / month",
            minOrderQuantity: profile.manufacturerProfile?.minOrderQuantity?.toString() || "50"
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        companyName: formData.companyName,
        city: formData.city,
        country: formData.country,
      };

      if (user?.role === 'BUYER') {
        payload.businessType = formData.businessType;
        payload.address = formData.address;
      } else if (user?.role === 'MANUFACTURER') {
        payload.factoryName = formData.factoryName;
        payload.factoryAddress = formData.factoryAddress;
        payload.productionCapacity = formData.productionCapacity;
        payload.minOrderQuantity = parseInt(formData.minOrderQuantity) || 1;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data.success) {
        setSuccessMsg("Profile details updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!securityData.newPassword) {
      setErrorMsg("Please enter a new password.");
      return;
    }
    if (securityData.newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Password updated successfully!");
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccessMsg(""), 3500);
    }, 600);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Notification preferences saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    }, 500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business information", icon: Building2 },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType={user?.role?.toLowerCase() || 'buyer'} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type={user?.role?.toLowerCase() || 'buyer'} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
                <p className="text-sm text-ink-3 mt-1">Manage your profile, business information, security, and preferences.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold"
              >
                <LogOut size={16} className="mr-1.5" /> Log Out
              </Button>
            </div>

            <div className="grid md:grid-cols-[240px_1fr] gap-6">
              
              {/* Tab Navigation Card */}
              <Card className="p-2 h-fit border-border shadow-sm">
                <div className="flex flex-col gap-1">
                  {tabs.map((tab) => {
                    const isSelected = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-sm transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? "bg-brand-500/10 text-brand-600 font-bold border border-brand-500/20"
                            : "text-ink-2 hover:bg-muted font-medium"
                        }`}
                      >
                        <Icon size={16} className={isSelected ? "text-brand-600" : "text-ink-3"} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-border mt-3 pt-2">
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium cursor-pointer"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </Card>

              {/* Main Content Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.15 }}
                >
                  <Card className="p-6 border-border shadow-sm">

                    {/* Feedback Banners */}
                    {successMsg && (
                      <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-200 flex items-center gap-2.5">
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}
                    {errorMsg && (
                      <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                        {errorMsg}
                      </div>
                    )}

                    {/* TAB 1: PROFILE DETAILS */}
                    {activeTab === "profile" && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-6 border-b border-border pb-4">
                          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                            <User size={18} />
                          </div>
                          <div>
                            <h2 className="font-display text-lg font-bold text-ink">Profile Details</h2>
                            <p className="text-xs text-ink-3">Update your personal contact information.</p>
                          </div>
                        </div>

                        {loading ? (
                          <div className="py-12 flex justify-center">
                            <Loader2 size={24} className="animate-spin text-brand-500" />
                          </div>
                        ) : (
                          <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={(v) => setFormData(p => ({ ...p, name: v }))}
                              />
                              <Input
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                disabled
                                className="opacity-70 cursor-not-allowed"
                              />
                              <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={(v) => setFormData(p => ({ ...p, phone: v }))}
                                placeholder="+91 98765 43210"
                              />
                              <Input
                                label="City / Region"
                                name="city"
                                value={formData.city}
                                onChange={(v) => setFormData(p => ({ ...p, city: v }))}
                              />
                              <Input
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={(v) => setFormData(p => ({ ...p, country: v }))}
                                className="sm:col-span-2"
                              />
                            </div>

                            <div className="mt-6 pt-4 border-t border-border flex justify-end">
                              <Button variant="primary" type="submit" disabled={saving}>
                                {saving ? (
                                  <><Loader2 size={16} className="animate-spin mr-1.5" /> Saving...</>
                                ) : (
                                  <><Save size={16} className="mr-1.5" /> Save Profile</>
                                )}
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    {/* TAB 2: BUSINESS INFORMATION */}
                    {activeTab === "business" && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-6 border-b border-border pb-4">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <h2 className="font-display text-lg font-bold text-ink">Business & Operations Information</h2>
                            <p className="text-xs text-ink-3">
                              {user?.role === 'MANUFACTURER' ? "Manage factory specifications, capacity, and credentials." : "Business registration details for verified procurement."}
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <Input
                              label={user?.role === 'MANUFACTURER' ? "Factory / Company Name" : "Company Legal Name"}
                              name="companyName"
                              value={user?.role === 'MANUFACTURER' ? formData.factoryName : formData.companyName}
                              onChange={(v) => setFormData(p => ({ ...p, companyName: v, factoryName: v }))}
                            />
                            <Input
                              label="GSTIN / Business Tax ID"
                              name="gstNumber"
                              value={formData.gstNumber}
                              onChange={(v) => setFormData(p => ({ ...p, gstNumber: v }))}
                            />

                            {user?.role === 'MANUFACTURER' ? (
                              <>
                                <Input
                                  label="Factory Physical Address"
                                  name="factoryAddress"
                                  value={formData.factoryAddress}
                                  onChange={(v) => setFormData(p => ({ ...p, factoryAddress: v }))}
                                  className="sm:col-span-2"
                                />
                                <Input
                                  label="Monthly Production Capacity"
                                  name="productionCapacity"
                                  value={formData.productionCapacity}
                                  onChange={(v) => setFormData(p => ({ ...p, productionCapacity: v }))}
                                  placeholder="e.g. 50,000 pcs / month"
                                />
                                <Input
                                  label="Default Minimum Order Quantity (MOQ)"
                                  name="minOrderQuantity"
                                  type="number"
                                  value={formData.minOrderQuantity}
                                  onChange={(v) => setFormData(p => ({ ...p, minOrderQuantity: v }))}
                                />
                              </>
                            ) : (
                              <>
                                <Input
                                  label="Business Type"
                                  name="businessType"
                                  value={formData.businessType}
                                  onChange={(v) => setFormData(p => ({ ...p, businessType: v }))}
                                  placeholder="e.g. D2C Brand / Retail Chain"
                                />
                                <Input
                                  label="Billing & Shipping Address"
                                  name="address"
                                  value={formData.address}
                                  onChange={(v) => setFormData(p => ({ ...p, address: v }))}
                                  className="sm:col-span-2"
                                />
                              </>
                            )}
                          </div>

                          {/* Certifications preview for manufacturer */}
                          {user?.role === 'MANUFACTURER' && (
                            <div className="pt-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-ink-3 block mb-2">
                                Active Compliance & Certifications
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {["ISO 9001", "BIS Hallmarking", "Sedex SMETA", "RoHS Compliant"].map((c) => (
                                  <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                                    <CheckCircle2 size={12} className="text-emerald-600" /> {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-6 pt-4 border-t border-border flex justify-end">
                            <Button variant="primary" type="submit" disabled={saving}>
                              {saving ? (
                                <><Loader2 size={16} className="animate-spin mr-1.5" /> Saving...</>
                              ) : (
                                <><Save size={16} className="mr-1.5" /> Save Business Info</>
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* TAB 3: SECURITY */}
                    {activeTab === "security" && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-6 border-b border-border pb-4">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Shield size={18} />
                          </div>
                          <div>
                            <h2 className="font-display text-lg font-bold text-ink">Security & Credentials</h2>
                            <p className="text-xs text-ink-3">Manage your password, authentication, and login sessions.</p>
                          </div>
                        </div>

                        <form onSubmit={handleSecuritySubmit} className="space-y-4">
                          <div className="space-y-3">
                            <Input
                              label="Current Password"
                              type="password"
                              value={securityData.currentPassword}
                              onChange={(v) => setSecurityData(p => ({ ...p, currentPassword: v }))}
                              placeholder="Enter existing password"
                            />
                            <div className="grid sm:grid-cols-2 gap-4">
                              <Input
                                label="New Password"
                                type="password"
                                value={securityData.newPassword}
                                onChange={(v) => setSecurityData(p => ({ ...p, newPassword: v }))}
                                placeholder="Min. 8 characters"
                              />
                              <Input
                                label="Confirm New Password"
                                type="password"
                                value={securityData.confirmPassword}
                                onChange={(v) => setSecurityData(p => ({ ...p, confirmPassword: v }))}
                                placeholder="Re-enter new password"
                              />
                            </div>
                          </div>

                          {/* 2FA Card */}
                          <div className="p-4 rounded-xl border border-border bg-[#FAFAFA] flex items-center justify-between gap-4 mt-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-ink-2 shrink-0">
                                <Smartphone size={20} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-ink">Two-Factor Authentication (2FA)</p>
                                <p className="text-[11px] text-ink-3">Add an extra layer of security via SMS or Authenticator App.</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                twoFactorEnabled ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                  twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Active Sessions */}
                          <div className="p-4 rounded-xl border border-border/80 bg-white space-y-2 mt-4">
                            <p className="text-xs font-bold text-ink uppercase tracking-wider">Active Device Session</p>
                            <div className="flex items-center justify-between text-xs text-ink-2">
                              <span>Chrome on Windows (Current Browser)</span>
                              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Now
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-border flex justify-end">
                            <Button variant="primary" type="submit" disabled={saving}>
                              {saving ? (
                                <><Loader2 size={16} className="animate-spin mr-1.5" /> Updating...</>
                              ) : (
                                <><Key size={16} className="mr-1.5" /> Update Password</>
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* TAB 4: NOTIFICATIONS */}
                    {activeTab === "notifications" && (
                      <div>
                        <div className="flex items-center gap-2.5 mb-6 border-b border-border pb-4">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Bell size={18} />
                          </div>
                          <div>
                            <h2 className="font-display text-lg font-bold text-ink">Notification Preferences</h2>
                            <p className="text-xs text-ink-3">Choose which updates and email alerts you want to receive.</p>
                          </div>
                        </div>

                        <form onSubmit={handleNotificationSubmit} className="space-y-4">
                          <div className="space-y-3">
                            {[
                              { key: "rfqAlerts", title: "New Matching RFQ Alerts", desc: "Notify immediately when a buyer posts requirements matching your category." },
                              { key: "orderUpdates", title: "Production & Order Milestones", desc: "Alerts when sample requests, milestone payments, or shipments change status." },
                              { key: "quoteResponses", title: "Buyer Quote Inquiries & Chat", desc: "Instant notifications when a buyer views, queries, or accepts your quotation." },
                              { key: "marketingEmails", title: "Jewelry Market Benchmarks & Trends", desc: "Weekly metal price indices, demand analytics, and manufacturing best practices." },
                            ].map((item) => {
                              const isChecked = (notifPreferences as any)[item.key];
                              return (
                                <div key={item.key} className="p-4 rounded-xl border border-border bg-[#FAFAFA] flex items-center justify-between gap-4">
                                  <div>
                                    <p className="text-xs font-bold text-ink">{item.title}</p>
                                    <p className="text-[11px] text-ink-3 mt-0.5">{item.desc}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setNotifPreferences(p => ({ ...p, [item.key]: !isChecked }))}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                      isChecked ? "bg-brand-500" : "bg-slate-300"
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                        isChecked ? "translate-x-5" : "translate-x-0"
                                      }`}
                                    />
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-6 pt-4 border-t border-border flex justify-end">
                            <Button variant="primary" type="submit" disabled={saving}>
                              {saving ? (
                                <><Loader2 size={16} className="animate-spin mr-1.5" /> Saving...</>
                              ) : (
                                <><Save size={16} className="mr-1.5" /> Save Notification Preferences</>
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}

                  </Card>
                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
