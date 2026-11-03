import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Package, X, Image as ImageIcon, Upload } from "lucide-react";
import { DashboardNavbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Card, Button, Badge } from "../components/ui";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { parseImages, resizeImageFile } from "../utils/image";

const SAMPLE_PRESETS = [
  { label: "Jewelry", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=500" },
  { label: "Earrings", url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=500" },
  { label: "Apparel", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500" },
  { label: "Packaging", url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=500" },
  { label: "Cosmetics", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=500" },
];

export default function ManufacturerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [unit, setUnit] = useState("piece");
  const [imageUrl, setImageUrl] = useState("");
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url" | "presets">("upload");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.data.success) {
        const myProducts = res.data.data.products.filter((p: any) => p.manufacturerId === user?.id);
        setProducts(myProducts);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setModalError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setUploadingImage(true);
      setModalError("");
      const compressedDataUrl = await resizeImageFile(file, 800, 800, 0.85);
      setImageUrl(compressedDataUrl);
    } catch (err) {
      console.error("Failed to process image", err);
      setModalError("Failed to process image file. Please try another image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setMinOrderQuantity("");
    setUnit("piece");
    setImageUrl("");
    setImageInputMode("upload");
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setTitle(p.title);
    setDescription(p.description || "");
    setPrice(p.price.toString());
    setMinOrderQuantity(p.minOrderQuantity.toString());
    setUnit(p.unit || "piece");
    setImageUrl(parseImages(p.images, ""));
    setImageInputMode(p.images ? "url" : "upload");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product.");
    }
  };

  const handleSave = async () => {
    setModalError("");

    if (!title.trim()) {
      setModalError("Please enter a product title.");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setModalError("Please enter a valid price greater than 0.");
      return;
    }
    const parsedMoq = parseInt(minOrderQuantity, 10);
    if (isNaN(parsedMoq) || parsedMoq <= 0) {
      setModalError("Please enter a minimum order quantity (MOQ) of at least 1.");
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      minOrderQuantity: parsedMoq,
      unit: unit.trim() || "piece",
      images: imageUrl.trim() ? [imageUrl.trim()] : []
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsModalOpen(false);
      fetchProducts(); // refresh
    } catch (err: any) {
      console.error("Failed to save product", err);
      const errorMsg =
        err.response?.data?.details?.map((d: any) => d.message).join(". ") ||
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK" || !err.response
          ? "Cannot connect to backend server. Please make sure the backend is running."
          : "Failed to save product. Please check your inputs.");
      setModalError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface">
      <DashboardNavbar userType="manufacturer" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar type="manufacturer" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">My Products</h1>
                <p className="text-sm text-ink-3 mt-1">Manage your catalogue visible to buyers.</p>
              </div>
              <Button variant="primary" onClick={openAddModal}>
                <Plus size={16} /> Add Product
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-muted rounded-xl h-64"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="py-20 text-center border-dashed">
                  <Package size={48} className="text-brand-500/50 mx-auto mb-4" />
                  <p className="font-display text-lg font-bold text-ink mb-2">No products added yet</p>
                  <p className="text-sm text-ink-3 mb-6 max-w-sm mx-auto">Build your catalogue to show buyers what you can manufacture.</p>
                  <Button variant="primary" onClick={openAddModal}>Add Your First Product</Button>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {products.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="p-0 overflow-hidden group hover:border-brand-500/50 transition-colors h-full flex flex-col relative">
                        <div className="h-40 bg-muted flex items-center justify-center relative">
                          {p.images && parseImages(p.images, '') ? (
                            <img src={parseImages(p.images, '')} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={32} className="text-ink-3/30" />
                          )}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(p)} className="p-2 bg-white rounded-lg shadow hover:text-brand-500 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 bg-white rounded-lg shadow hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-ink mb-1 line-clamp-1">{p.title}</h3>
                          <p className="text-xs text-ink-3 mb-4 line-clamp-2 flex-1">{p.description}</p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-baseline gap-1">
                              <span className="font-bold text-lg text-ink">₹{p.price}</span>
                              <span className="text-xs text-ink-3">/{p.unit}</span>
                            </div>
                            <Badge variant="muted">MOQ: {p.minOrderQuantity}</Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-surface">
                <h2 className="font-display font-bold text-lg text-ink">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-ink-3 hover:text-ink">
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center justify-between">
                  <span>{modalError}</span>
                  <button type="button" onClick={() => setModalError("")} className="text-red-400 hover:text-red-700 font-bold ml-2">×</button>
                </div>
              )}

              <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-ink-2">Product Title *</label>
                  <input 
                    type="text" 
                    value={title} onChange={(e) => { setModalError(""); setTitle(e.target.value); }}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="e.g. Premium Cotton T-Shirt"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-ink-2">Description</label>
                  <textarea 
                    value={description} onChange={(e) => { setModalError(""); setDescription(e.target.value); }}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                    placeholder="Describe materials, sizing, etc."
                    rows={4}
                  />
                </div>

                {/* Product Image Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-ink-2">Product Image</label>
                    <div className="flex text-xs bg-[#F3F4F6] p-0.5 rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() => setImageInputMode("upload")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          imageInputMode === "upload" ? "bg-white text-ink font-semibold shadow-xs" : "text-ink-3 hover:text-ink"
                        }`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode("url")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          imageInputMode === "url" ? "bg-white text-ink font-semibold shadow-xs" : "text-ink-3 hover:text-ink"
                        }`}
                      >
                        Web Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode("presets")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          imageInputMode === "presets" ? "bg-white text-ink font-semibold shadow-xs" : "text-ink-3 hover:text-ink"
                        }`}
                      >
                        Presets
                      </button>
                    </div>
                  </div>

                  {imageUrl ? (
                    <div className="relative rounded-xl border border-border overflow-hidden bg-surface-2 h-44 group">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-white text-ink text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-md">
                          <Upload size={14} /> Replace
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {imageInputMode === "upload" && (
                        <label className="border-2 border-dashed border-border hover:border-brand-500 hover:bg-brand-50/20 transition-all rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer text-center group">
                          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform mb-2">
                            {uploadingImage ? (
                              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload size={20} />
                            )}
                          </div>
                          <p className="text-sm font-medium text-ink">
                            {uploadingImage ? "Optimizing image..." : "Click or drag to upload product photo"}
                          </p>
                          <p className="text-xs text-ink-3 mt-0.5">PNG, JPG, or WEBP (auto-compressed)</p>
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                      )}

                      {imageInputMode === "url" && (
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        />
                      )}

                      {imageInputMode === "presets" && (
                        <div className="flex gap-2 flex-wrap">
                          {SAMPLE_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setImageUrl(preset.url)}
                              className="flex items-center gap-2 border border-border rounded-lg p-1.5 pr-3 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-xs font-medium text-ink"
                            >
                              <img src={preset.url} alt={preset.label} className="w-7 h-7 rounded object-cover" />
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-ink-2">Price (₹) *</label>
                    <input 
                      type="number" 
                      value={price} onChange={(e) => { setModalError(""); setPrice(e.target.value); }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-ink-2">Unit</label>
                    <input 
                      type="text" 
                      value={unit} onChange={(e) => { setModalError(""); setUnit(e.target.value); }}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                      placeholder="e.g. piece, kg, set"
                      list="unit-suggestions"
                    />
                    <datalist id="unit-suggestions">
                      <option value="piece" />
                      <option value="pair" />
                      <option value="set" />
                      <option value="kg" />
                      <option value="meter" />
                      <option value="box" />
                      <option value="dozen" />
                    </datalist>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-ink-2">Minimum Order Quantity (MOQ) *</label>
                  <input 
                    type="number" 
                    value={minOrderQuantity} onChange={(e) => { setModalError(""); setMinOrderQuantity(e.target.value); }}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="p-5 border-t border-border bg-surface flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
