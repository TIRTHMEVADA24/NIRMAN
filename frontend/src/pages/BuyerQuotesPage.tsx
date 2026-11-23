import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock, ArrowRight, MessageSquare, Plus } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Button, Card, Badge, VerifiedBadge } from "../components/ui";
import api from "../api/client";

export default function BuyerQuotesPage() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "PENDING" | "ACCEPTED">("all");

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const res = await api.get('/quotes');
        if (res.data.success) {
          setQuotes(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch quotes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const filteredQuotes = filter === "all" ? quotes : quotes.filter(q => q.status === filter);

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#111827]">Quotation Offers</h1>
                <p className="text-sm text-[#6B7280] mt-0.5">Review and compare bids received from verified manufacturers.</p>
              </div>
              <Link to="/post-requirement">
                <Button variant="primary">
                  <Plus size={16} className="mr-1.5" /> Post New Requirement
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <p className="text-xs font-medium text-[#6B7280]">Total Quotes</p>
                <p className="text-2xl font-bold text-[#111827] mt-1">{quotes.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-[#6B7280]">Pending Review</p>
                <p className="text-2xl font-bold text-[#D97706] mt-1">
                  {quotes.filter(q => q.status === 'PENDING').length}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-[#6B7280]">Accepted Quotes</p>
                <p className="text-2xl font-bold text-[#059669] mt-1">
                  {quotes.filter(q => q.status === 'ACCEPTED').length}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-[#6B7280]">Avg Turnaround</p>
                <p className="text-2xl font-bold text-[#4F46E5] mt-1">10-14 days</p>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-5">
              {(["all", "PENDING", "ACCEPTED"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    filter === tab
                      ? "bg-[#111827] text-white"
                      : "bg-white text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]"
                  }`}
                >
                  {tab === "all" ? "All Quotes" : tab === "PENDING" ? "Pending" : "Accepted"}
                </button>
              ))}
            </div>

            {/* Quotes List */}
            {loading ? (
              <div className="py-20 text-center text-sm text-[#6B7280]">Loading quotations...</div>
            ) : filteredQuotes.length === 0 ? (
              <Card className="py-16 text-center border-dashed">
                <FileText size={36} className="mx-auto text-[#9CA3AF] mb-3" />
                <p className="text-base font-semibold text-[#111827]">No quotes found</p>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1 mb-4">
                  Once manufacturers submit proposals for your requirements, they will appear here.
                </p>
                <Link to="/post-requirement">
                  <Button variant="outline" size="sm">Post a Requirement</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((q) => {
                  const rfqTitle = q.rfq?.title || "Custom Sourcing Requirement";
                  const mfrName = q.manufacturer?.companyName || q.manufacturer?.name || "Artisan Metals Co.";
                  return (
                    <Card key={q.id} className="p-5 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-medium text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded">
                              {q.id.split('-')[0]}
                            </span>
                            <Badge variant={q.status === 'ACCEPTED' ? 'success' : 'brand'}>
                              {q.status || 'PENDING'}
                            </Badge>
                            <span className="text-xs text-[#9CA3AF]">
                              {new Date(q.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>

                          <h2 className="font-semibold text-base text-[#111827] mb-1">
                            {rfqTitle}
                          </h2>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                            <span className="font-medium text-[#374151] flex items-center gap-1">
                              {mfrName} <VerifiedBadge />
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={13} className="text-[#9CA3AF]" /> {q.deliveryTimeDays || 12} days production
                            </span>
                          </div>

                          {q.notes && (
                            <p className="text-xs text-[#4B5563] bg-[#F9FAFB] p-2.5 rounded-lg mt-3 border border-[#F3F4F6]">
                              "{q.notes}"
                            </p>
                          )}
                        </div>

                        {/* Pricing and Actions */}
                        <div className="flex sm:flex-row lg:flex-col items-start lg:items-end justify-between sm:justify-start gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F3F4F6]">
                          <div className="text-left lg:text-right">
                            <p className="text-xs text-[#6B7280]">Offered Price</p>
                            <p className="text-xl font-bold text-[#111827]">
                              ₹{q.unitPrice || 95}
                              <span className="text-xs font-normal text-[#6B7280]">/pc</span>
                            </p>
                            {q.totalPrice && (
                              <p className="text-[11px] text-[#059669] font-medium">Total: ₹{q.totalPrice.toLocaleString('en-IN')}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {q.rfqId && (
                              <Link to={`/quotes/${q.rfqId}`}>
                                <Button variant="outline" size="sm">
                                  Compare <ArrowRight size={13} className="ml-1" />
                                </Button>
                              </Link>
                            )}
                            <Link to="/messages">
                              <Button variant="ghost" size="sm" className="text-[#6B7280]">
                                <MessageSquare size={14} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
