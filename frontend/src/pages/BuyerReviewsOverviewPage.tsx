import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, CheckCircle2, MessageSquare, ThumbsUp, ArrowRight } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Button, Card, VerifiedBadge } from "../components/ui";
import api from "../api/client";

export default function BuyerReviewsOverviewPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(Array.isArray(res.data.data) ? res.data.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const verifiedReviews = [
    {
      id: "rev-1",
      buyerName: "Riya Sharma",
      brand: "Lumina Jewels",
      manufacturerName: "Artisan Metals Co.",
      product: "925 Sterling Silver Hoop Earrings",
      rating: 5,
      date: "2 days ago",
      comment: "Outstanding sample finish and exact adherence to 925 silver specs. Delivered 200 pcs 3 days ahead of schedule.",
      tags: ["Quality: 5.0", "Speed: 5.0", "Packaging: 4.8"]
    },
    {
      id: "rev-2",
      buyerName: "Kabir Singh",
      brand: "Aesthetic Aura",
      manufacturerName: "Silver Peak Factory",
      product: "Boho Oxidized Silver Rings",
      rating: 5,
      date: "1 week ago",
      comment: "Superb laser engraving on the inner band. Their communication throughout production was very professional.",
      tags: ["Quality: 4.9", "Accuracy: 5.0"]
    },
    {
      id: "rev-3",
      buyerName: "Neha Gupta",
      brand: "Minimalist D2C",
      manufacturerName: "Artisan Metals Co.",
      product: "18k Gold Plated Brass Pendant",
      rating: 4.8,
      date: "2 weeks ago",
      comment: "Micron gold plating was flawless and didn't tarnish during salt-spray testing. Definitely reordering next month.",
      tags: ["Plating: 5.0", "Finishing: 4.8"]
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA]">
      <DashboardNavbar userType="buyer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="buyer" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-[#111827]">Reviews & Quality Ratings</h1>
              <p className="text-sm text-[#6B7280] mt-0.5">Verified manufacturer quality reports and reviews from D2C brand buyers.</p>
            </div>

            {/* Quality Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white border-[#FDE68A]">
                <p className="text-xs font-semibold text-[#92400E]">Average Supplier Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#111827]">4.9</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <p className="text-xs font-medium text-[#6B7280]">Quality Inspection Pass</p>
                <p className="text-2xl font-bold text-[#059669] mt-1">98.4%</p>
              </Card>

              <Card className="p-4">
                <p className="text-xs font-medium text-[#6B7280]">On-Time Delivery</p>
                <p className="text-2xl font-bold text-[#4F46E5] mt-1">96.8%</p>
              </Card>

              <Card className="p-4">
                <p className="text-xs font-medium text-[#6B7280]">Verified Reviews</p>
                <p className="text-2xl font-bold text-[#111827] mt-1">142+</p>
              </Card>
            </div>

            {/* Orders ready to review */}
            {orders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-3">Orders Eligible for Feedback</h2>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((o) => (
                    <Card key={o.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#111827]">Order #{o.orderNumber || o.id?.split('-')[0]}</span>
                          <span className="text-xs text-[#059669] font-medium bg-[#ECFDF5] px-2 py-0.5 rounded">Delivered</span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {o.product?.title || "Custom Jewelry Order"} · {o.manufacturer?.companyName || "Verified Manufacturer"}
                        </p>
                      </div>
                      <Link to={`/reviews/${o.id}`}>
                        <Button variant="primary" size="sm">
                          Write Review <ArrowRight size={13} className="ml-1" />
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Community Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#111827]">Verified Brand Feedback</h2>
                <span className="text-xs text-[#6B7280] flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#059669]" /> All reviews verified by delivery proof
                </span>
              </div>

              <div className="space-y-4">
                {verifiedReviews.map((rev) => (
                  <Card key={rev.id} className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[#111827]">{rev.buyerName}</p>
                          <span className="text-xs text-[#6B7280]">• {rev.brand}</span>
                        </div>
                        <p className="text-xs text-[#4F46E5] font-medium mt-0.5">
                          Supplier: {rev.manufacturerName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold text-amber-700">
                        <Star size={12} fill="currentColor" /> {rev.rating}.0
                      </div>
                    </div>

                    <p className="text-sm text-[#374151] leading-relaxed mb-3">
                      "{rev.comment}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F3F4F6] text-xs text-[#9CA3AF]">
                      <div className="flex items-center gap-2">
                        {rev.tags.map(t => (
                          <span key={t} className="bg-[#F3F4F6] text-[#4B5563] text-[11px] px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span>{rev.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
