import { useState, useEffect } from "react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Button, Badge } from "../components/ui";
import {
  TrendingUp, BarChart3, Users, DollarSign, Calendar,
  ArrowUpRight, ArrowDownRight, Layers, CheckCircle2, Clock,
  Target, Sparkles, Filter, ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/client";

const monthlyData30 = [
  { period: "Week 1", quotes: 6, orders: 2, revenue: 65000 },
  { period: "Week 2", quotes: 9, orders: 4, revenue: 120000 },
  { period: "Week 3", quotes: 11, orders: 5, revenue: 155000 },
  { period: "Week 4", quotes: 8, orders: 3, revenue: 95000 },
];

const monthlyData90 = [
  { period: "Jul", quotes: 18, orders: 7, revenue: 210000 },
  { period: "Aug", quotes: 24, orders: 9, revenue: 290000 },
  { period: "Sep", quotes: 29, orders: 12, revenue: 380000 },
  { period: "Oct", quotes: 34, orders: 14, revenue: 435000 },
];

const monthlyDataYear = [
  { period: "Q1", quotes: 42, orders: 15, revenue: 520000 },
  { period: "Q2", quotes: 68, orders: 26, revenue: 840000 },
  { period: "Q3", quotes: 91, orders: 35, revenue: 1180000 },
  { period: "Q4", quotes: 104, orders: 42, revenue: 1420000 },
];

const categoryBreakdown = [
  { name: "Brass & Fashion Jewelry", share: 45, revenue: "₹2,18,000", orders: 18, growth: "+24%" },
  { name: "Gold-Plated Hoops & Chains", share: 30, revenue: "₹1,45,000", orders: 12, growth: "+18%" },
  { name: "Silver & Stone Setting", share: 15, revenue: "₹72,000", orders: 6, growth: "+12%" },
  { name: "Custom Medallions & Charms", share: 10, revenue: "₹50,000", orders: 4, growth: "+31%" },
];

export default function ManufacturerAnalytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"30" | "90" | "year">("90");
  const [ordersCount, setOrdersCount] = useState<number>(14);
  const [totalRevenue, setTotalRevenue] = useState<number>(435000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setOrdersCount(res.data.data.length);
        const sum = res.data.data.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);
        if (sum > 0) setTotalRevenue(sum);
      }
    } catch (err) {
      console.warn("Using sample analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = timeRange === "30" ? monthlyData30 : timeRange === "90" ? monthlyData90 : monthlyDataYear;

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="manufacturer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="manufacturer" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Header with time range selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Performance Insights</span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Manufacturer Analytics</h1>
                <p className="text-sm text-ink-3 mt-1">
                  Monitor your pipeline, quote conversion rates, buyer reach, and production revenue.
                </p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-border shadow-sm">
                <button
                  onClick={() => setTimeRange("30")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === "30" ? "bg-brand-500 text-white shadow-sm" : "text-ink-2 hover:bg-surface"
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setTimeRange("90")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === "90" ? "bg-brand-500 text-white shadow-sm" : "text-ink-2 hover:bg-surface"
                  }`}
                >
                  Last 90 Days
                </button>
                <button
                  onClick={() => setTimeRange("year")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    timeRange === "year" ? "bg-brand-500 text-white shadow-sm" : "text-ink-2 hover:bg-surface"
                  }`}
                >
                  Full Year
                </button>
              </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Production Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-ink">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight size={14} /> +22.4% vs last period
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Quote Win Rate</span>
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-ink">38.2%</span>
                  <span className="text-xs text-ink-3">({ordersCount} won)</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight size={14} /> +5.6% benchmark beat
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Avg Response Time</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-ink">2.1 hrs</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Top 10% Fastest responder
                </p>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Capacity Utilization</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-display font-bold text-ink">74%</span>
                  <span className="text-xs text-ink-3">/ 50k pcs MOQ</span>
                </div>
                <p className="text-xs text-ink-3 mt-2">Optimal production workload</p>
              </Card>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Quotes vs Orders Chart */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">Quotes Sent vs Won Orders</h3>
                    <p className="text-xs text-ink-3 mt-0.5">Volume comparison across periods</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-ink-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-brand-400"></span> Quotes
                    </span>
                    <span className="flex items-center gap-1.5 text-ink-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Orders
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="period" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      />
                      <Bar dataKey="quotes" fill="#818CF8" radius={[4, 4, 0, 0]} name="Quotes Sent" />
                      <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} name="Orders Won" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Revenue Trend Area Chart */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">Gross Revenue Trajectory</h3>
                    <p className="text-xs text-ink-3 mt-0.5">Total completed order billing</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Upward Momentum
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="period" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, "Revenue"]}
                        contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

            </div>

            {/* Sourcing Conversion Funnel & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Conversion Funnel */}
              <Card className="p-5 lg:col-span-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-ink mb-1">RFQ Conversion Funnel</h3>
                  <p className="text-xs text-ink-3 mb-5">Buyer journey from search to closed order</p>

                  <div className="space-y-4">
                    {[
                      { step: "RFQs Matched", count: 128, pct: 100, color: "bg-indigo-600" },
                      { step: "Quotes Submitted", count: 48, pct: 37.5, color: "bg-indigo-500" },
                      { step: "Samples Requested", count: 22, pct: 17.2, color: "bg-indigo-400" },
                      { step: "Bulk Orders Won", count: 16, pct: 12.5, color: "bg-emerald-500" },
                    ].map((item, idx) => (
                      <div key={item.step} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-ink">{item.step}</span>
                          <span className="font-bold text-ink-2">{item.count} ({item.pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div className="flex items-start gap-2">
                    <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">High Sample Conversion</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        72.7% of buyers who received your samples proceeded with a full bulk production order.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Category Breakdown Table */}
              <Card className="p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-ink">Product Category Performance</h3>
                    <p className="text-xs text-ink-3 mt-0.5">Revenue breakdown by product specializations</p>
                  </div>
                  <span className="text-xs text-ink-3 font-medium">Top 4 lines</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-ink-3 font-bold uppercase tracking-wider">
                        <th className="pb-3">Category</th>
                        <th className="pb-3 text-right">Orders</th>
                        <th className="pb-3 text-right">Revenue</th>
                        <th className="pb-3 text-right">Share</th>
                        <th className="pb-3 text-right">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {categoryBreakdown.map((cat) => (
                        <tr key={cat.name} className="hover:bg-surface/50 transition-colors">
                          <td className="py-3 font-semibold text-ink flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                            {cat.name}
                          </td>
                          <td className="py-3 text-right text-ink-2 font-medium">{cat.orders}</td>
                          <td className="py-3 text-right font-bold text-ink">{cat.revenue}</td>
                          <td className="py-3 text-right text-ink-2">
                            <span className="font-semibold text-brand-600">{cat.share}%</span>
                          </td>
                          <td className="py-3 text-right">
                            <span className="inline-flex items-center font-bold text-emerald-600">
                              {cat.growth}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pro Tip */}
                <div className="mt-5 p-3.5 bg-brand-50/60 rounded-xl border border-brand-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Target size={16} className="text-brand-600 shrink-0" />
                    <p className="text-xs text-brand-900">
                      <strong>Opportunity:</strong> Inquiries for "Gold-Plated Hoops" increased 45% this week in Ahmedabad.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => window.location.href = '/mfr/products'}>
                    Add Product
                  </Button>
                </div>
              </Card>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

