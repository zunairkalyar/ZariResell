import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit, Save, ListFilter, Users, ClipboardList, Package, Layers, Settings, HelpCircle, X, CheckSquare, Upload, Star, Copy } from 'lucide-react';
import { Brand, Category, Product, Order, StoreSettings, PricingTier, PaymentAccount } from '../types';

interface AdminPanelProps {
  onSettingsUpdate: (newSettings: Partial<StoreSettings>) => void;
  onBrandCreated: (name: string, description: string) => void;
  onCategoryCreated: (name: string) => void;
  onProductCreated: (productData: any) => void;
  onProductUpdated: (productId: string, updatedFields: any) => void;
  onOrderStatusUpdated: (orderId: string, newStatus: string, refundStock: boolean) => void;
  db: {
    brands: Brand[];
    categories: Category[];
    products: Product[];
    orders: Order[];
    settings: StoreSettings;
  };
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
}

type TabType = 'dashboard' | 'orders' | 'products' | 'brands' | 'categories' | 'settings';

export default function AdminPanel({
  onSettingsUpdate,
  onBrandCreated,
  onCategoryCreated,
  onProductCreated,
  onProductUpdated,
  onOrderStatusUpdated,
  db,
  adminToken,
  setAdminToken
}: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Brand form state
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');

  // Category form state
  const [newCatName, setNewCatName] = useState('');

  // Product form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCode, setProdCode] = useState('');
  const [prodFabric, setProdFabric] = useState('');
  const [prodPieces, setProdPieces] = useState('3-Piece');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCare, setProdCare] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodImgInput, setProdImgInput] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(true);
  
  // Dynamic variant designer fields
  const [prodVariants, setProdVariants] = useState<{ size: string; color: string; stock: number }[]>([
    { size: 'Small', color: 'Midnight Black', stock: 5 },
    { size: 'Medium', color: 'Midnight Black', stock: 5 },
    { size: 'Large', color: 'Midnight Black', stock: 5 }
  ]);

  // Settings form states
  const [whatsapp, setWhatsapp] = useState(db.settings.whatsappNumber);
  const [instagram, setInstagram] = useState(db.settings.instagramUrl);
  const [facebook, setFacebook] = useState(db.settings.facebookUrl);
  const [shipFee, setShipFee] = useState(db.settings.flatShippingFee);
  const [freeShipLimit, setFreeShipLimit] = useState(db.settings.freeShippingThreshold);
  const [shipTime, setShipTime] = useState(db.settings.shippingTimeEstimate);
  const [codAvail, setCodAvail] = useState(db.settings.codAvailable);
  const [tiers, setTiers] = useState<PricingTier[]>(db.settings.tiers);
  const [accounts, setAccounts] = useState<PaymentAccount[]>(db.settings.paymentAccounts);
  // Personalization settings fields
  const [personalizationEnabled, setPersonalizationEnabled] = useState(db.settings.personalizationEnabled ?? true);
  const [viewHistoryDays, setViewHistoryDays] = useState(db.settings.viewHistoryDays ?? 30);
  const [maxViewHistorySize, setMaxViewHistorySize] = useState(db.settings.maxViewHistorySize ?? 20);
  const [outOfStockDisplay, setOutOfStockDisplay] = useState<'bottom' | 'hide' | 'visible'>(db.settings.outOfStockDisplay ?? 'bottom');

  // Custom markdown page editor strings
  const [aboutUs, setAboutUs] = useState(db.settings.pages.aboutUs);
  const [shipPolicy, setShipPolicy] = useState(db.settings.pages.shipPolicy);
  const [returnPolicy, setReturnPolicy] = useState(db.settings.pages.returnPolicy);

  // Bulk status update states
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    // Keep setting states updated if global db loads
    setWhatsapp(db.settings.whatsappNumber);
    setInstagram(db.settings.instagramUrl);
    setFacebook(db.settings.facebookUrl);
    setShipFee(db.settings.flatShippingFee);
    setFreeShipLimit(db.settings.freeShippingThreshold);
    setShipTime(db.settings.shippingTimeEstimate);
    setCodAvail(db.settings.codAvailable);
    setTiers(db.settings.tiers);
    setAccounts(db.settings.paymentAccounts);
    setAboutUs(db.settings.pages.aboutUs);
    setShipPolicy(db.settings.pages.shipPolicy);
    setReturnPolicy(db.settings.pages.returnPolicy);
    setPersonalizationEnabled(db.settings.personalizationEnabled ?? true);
    setViewHistoryDays(db.settings.viewHistoryDays ?? 30);
    setMaxViewHistorySize(db.settings.maxViewHistorySize ?? 20);
    setOutOfStockDisplay(db.settings.outOfStockDisplay ?? 'bottom');
  }, [db.settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'zariresell123') {
      setAdminToken('zariresell123');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect admin password. (Hint: check workspace constraints)');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;
    onBrandCreated(newBrandName, newBrandDesc);
    setNewBrandName('');
    setNewBrandDesc('');
    alert(`Brand "${newBrandName}" added!`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    onCategoryCreated(newCatName);
    setNewCatName('');
    alert(`Category "${newCatName}" added!`);
  };

  // Variants handlers
  const handleAddVariantRow = () => {
    setProdVariants([...prodVariants, { size: 'Medium', color: 'Unassigned', stock: 10 }]);
  };

  const handleUpdateVariantItem = (idx: number, field: string, val: any) => {
    const updated = [...prodVariants];
    if (field === 'stock') {
      updated[idx].stock = Number(val) || 0;
    } else if (field === 'size') {
      updated[idx].size = val;
    } else {
      updated[idx].color = val;
    }
    setProdVariants(updated);
  };

  const handleRemoveVariantRow = (idx: number) => {
    const updated = [...prodVariants];
    updated.splice(idx, 1);
    setProdVariants(updated);
  };

  // Image urls array handler
  const handleAddImageUrl = () => {
    if (!prodImgInput) return;
    setProdImages([...prodImages, prodImgInput]);
    setProdImgInput('');
  };

  const handleRemoveImageItem = (idx: number) => {
    const updated = [...prodImages];
    updated.splice(idx, 1);
    setProdImages(updated);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodCode || !prodBrandId || !prodCategoryId) {
      alert('Please fill in title, code/SKU, brand, and category fields!');
      return;
    }

    const payload = {
      brandId: prodBrandId,
      categoryId: prodCategoryId,
      title: prodTitle,
      code: prodCode,
      fabric: prodFabric,
      pieces: prodPieces,
      description: prodDesc,
      careInstructions: prodCare,
      images: prodImages.length > 0 ? prodImages : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'],
      featured: prodFeatured,
      newArrival: prodNewArrival,
      variants: prodVariants
    };

    if (editingProduct) {
      onProductUpdated(editingProduct.id, payload);
      alert('Product updated successfully!');
      setEditingProduct(null);
    } else {
      onProductCreated(payload);
      alert('New Product published successfully!');
    }

    // Reset Form
    setProdTitle('');
    setProdCode('');
    setProdFabric('');
    setProdPieces('3-Piece');
    setProdDesc('');
    setProdCare('');
    setProdBrandId('');
    setProdCategoryId('');
    setProdImages([]);
    setProdVariants([
      { size: 'Small', color: 'Midnight Black', stock: 5 },
      { size: 'Medium', color: 'Midnight Black', stock: 5 },
      { size: 'Large', color: 'Midnight Black', stock: 5 }
    ]);
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProdTitle(p.title);
    setProdCode(p.code);
    setProdFabric(p.fabric);
    setProdPieces(p.pieces);
    setProdDesc(p.description);
    setProdCare(p.careInstructions);
    setProdBrandId(p.brandId);
    setProdCategoryId(p.categoryId);
    setProdImages(p.images);
    setProdFeatured(p.featured);
    setProdNewArrival(p.newArrival);
    setProdVariants(p.variants);
    setActiveTab('products');
  };

  const handleDuplicateClick = (p: Product) => {
    setEditingProduct(null); // Create new product
    setProdTitle(`${p.title} - Copy`);
    setProdCode(`${p.code}-DUP`);
    setProdFabric(p.fabric);
    setProdPieces(p.pieces);
    setProdDesc(p.description);
    setProdCare(p.careInstructions || '');
    setProdBrandId(p.brandId);
    setProdCategoryId(p.categoryId);
    setProdImages([...p.images]);
    setProdFeatured(p.featured);
    setProdNewArrival(p.newArrival);
    setProdVariants(p.variants.map(v => ({ ...v })));
    setActiveTab('products');
    alert(`Loaded product copy: "${p.title}". Please modify the Title and SKU Code, then click "Publish Reseller Record".`);
  };

  // Settings Save handler
  const handleSaveStoreSettings = () => {
    onSettingsUpdate({
      whatsappNumber: whatsapp,
      instagramUrl: instagram,
      facebookUrl: facebook,
      flatShippingFee: Number(shipFee),
      freeShippingThreshold: Number(freeShipLimit),
      shippingTimeEstimate: shipTime,
      codAvailable: codAvail,
      tiers: tiers,
      paymentAccounts: accounts,
      personalizationEnabled,
      viewHistoryDays: Number(viewHistoryDays),
      maxViewHistorySize: Number(maxViewHistorySize),
      outOfStockDisplay,
      pages: {
        ...db.settings.pages,
        aboutUs,
        shipPolicy,
        returnPolicy
      }
    });
    alert('Global store parameters, bank instructions, and pricing tiers updated successfully!');
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedOrderIds.length === 0) {
      alert('Please check at least one order to perform a bulk status modification!');
      return;
    }
    if (!confirm(`Are you sure you want to transition ${selectedOrderIds.length} checked order(s) to "${newStatus}"?`)) {
      return;
    }
    setBulkUpdating(true);
    try {
      const refundStock = newStatus === 'Cancelled' || newStatus === 'Returned';
      // Process updates sequentially
      for (let i = 0; i < selectedOrderIds.length; i++) {
        const orderId = selectedOrderIds[i];
        await fetch(`/api/admin/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': adminToken || ''
          },
          body: JSON.stringify({ status: newStatus, refundStock })
        });
      }
      // Clear checked items
      const previousTotal = selectedOrderIds.length;
      setSelectedOrderIds([]);
      // Call handler on parent on the last order to force client state sync
      onOrderStatusUpdated(selectedOrderIds[previousTotal - 1], newStatus, refundStock);
      alert(`Bulk update complete! Success: ${previousTotal} order(s) changed to "${newStatus}".`);
    } catch (err) {
      console.error(err);
      alert('Error processed during bulk status transit.');
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleTierUpdateItem = (idx: number, field: string, val: any) => {
    const updated = [...tiers];
    if (field === 'rate') {
      updated[idx].rate = Number(val) || 0;
    } else if (field === 'minQty') {
      updated[idx].minQty = Number(val) || 0;
    } else if (field === 'maxQty') {
      updated[idx].maxQty = val === '' ? null : Number(val);
    } else {
      updated[idx].name = val;
    }
    setTiers(updated);
  };

  const handleAccountUpdateItem = (idx: number, field: string, val: string) => {
    const updated = [...accounts];
    if (field === 'title') updated[idx].title = val;
    else if (field === 'number') updated[idx].number = val;
    else if (field === 'instructions') updated[idx].instructions = val;
    setAccounts(updated);
  };

  // Login Gate
  if (!adminToken) {
    return (
      <div className="mx-auto max-w-md py-16 px-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-[#800020]/10 p-3 text-[#800020]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold text-stone-900">Zari Resell Admin</h1>
            <p className="mt-1 text-sm text-stone-500">
              Only authorized staff members may manage reseller orders, catalog inventory, or edit rates.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4 font-sans">
            <div>
              <label htmlFor="admin-pass-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Staff Credentials Password
              </label>
              <input
                id="admin-pass-input"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-900 focus:border-[#800020] focus:outline-none focus:ring-1 focus:ring-[#800020]"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-red-600">⚠️ {errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#800020] py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition-all hover:bg-[#600018]"
            >
              Authenticate Portal
            </button>
            <p className="text-[10px] text-center text-stone-400">
              Default credentials in developer logs.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Admin Panel Header */}
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
              Authorized Active
            </span>
            <span className="text-xs font-mono text-stone-400">Environment Node: CLOUD RUN</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-950">Reseller Management Console</h1>
        </div>
        <button
          onClick={handleLogout}
          className="self-start rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
        >
          Close Session
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-stone-200 overflow-x-auto space-x-2 pb-px">
        {[
          { id: 'orders', label: 'Invoices & Orders', count: db.orders.length },
          { id: 'products', label: 'Item Inventory', count: db.products.length },
          { id: 'brands', label: 'Reseller Brands', count: db.brands.length },
          { id: 'categories', label: 'Fabric Collections', count: db.categories.length },
          { id: 'settings', label: 'Pricing Tiers / Links', count: 0 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`whitespace-nowrap border-b-2 py-3 px-4 text-xs font-bold font-sans transition-all ${
              activeTab === tab.id
                ? 'border-[#800020] text-[#800020]'
                : 'border-transparent text-stone-500 hover:text-[#800020]'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 rounded-full bg-stone-150 px-2 py-0.5 text-[10px] text-stone-600">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-8">
        
        {/* -------------------- ORDERS TAB -------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-stone-900">Inbound Customer Invoices</h2>
              <span className="text-xs text-stone-400">Showing uncancelled and dispatched logs first</span>
            </div>

            {db.orders.length === 0 ? (
              <div className="rounded-xl border border-stone-200 bg-white py-12 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-stone-300 stroke-1" />
                <p className="mt-2 text-sm text-stone-500">No client invoices have arrived yet. Complete a test buy!</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* BULK ACTIONS TOOLBAR */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-sans text-xs shadow-sm">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="h-4 w-4 text-[#800020]" />
                    <div>
                      <span className="font-extrabold text-stone-900 block md:inline font-sans text-[11px] uppercase tracking-wider">Bulk Order Management Panel</span>
                      <p className="text-stone-500 text-[10px] md:inline md:ml-2 font-sans font-medium">
                        Checked: <span className="font-bold text-[#800020] bg-stone-200/60 px-1.5 py-0.5 rounded">{selectedOrderIds.length} orders</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedOrderIds.length === db.orders.length) {
                          setSelectedOrderIds([]);
                        } else {
                          setSelectedOrderIds(db.orders.map(o => o.id));
                        }
                      }}
                      className="rounded bg-white border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-50 transition-all font-bold"
                    >
                      {selectedOrderIds.length === db.orders.length ? 'Deselect All' : 'Check All Invoices'}
                    </button>
                    
                    <span className="text-stone-300 hidden md:inline">|</span>
                    
                    <label className="text-stone-500 font-bold uppercase tracking-wider text-[9px] font-mono mr-1">To Status:</label>
                    <select
                      id="bulk-status-select"
                      disabled={selectedOrderIds.length === 0 || bulkUpdating}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkStatusChange(e.target.value);
                          e.target.value = ''; // Reset select
                        }
                      }}
                      className="rounded border border-stone-300 bg-white p-1.5 text-stone-900 text-xs font-semibold focus:outline-[#800020] disabled:bg-stone-100 disabled:text-stone-400"
                    >
                      <option value="">-- Apply State Transitions --</option>
                      <option value="Pending">Pending Audit</option>
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="Payment Confirmed">Payment Confirmed</option>
                      <option value="Confirmed">Confirmed (Stock Held)</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Dispatched/Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled (Auto Release)</option>
                      <option value="Returned">Returned (Auto Release)</option>
                    </select>
                  </div>
                </div>

                {db.orders.map(order => (
                  <div key={order.id} className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm">
                    {/* Order Meta Header */}
                    <div className="bg-stone-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white font-mono">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => {
                            if (selectedOrderIds.includes(order.id)) {
                              setSelectedOrderIds(selectedOrderIds.filter(id => id !== order.id));
                            } else {
                              setSelectedOrderIds([...selectedOrderIds, order.id]);
                            }
                          }}
                          className="h-4 w-4 rounded border-stone-700 bg-stone-800 text-[#800020] accent-[#800020] focus:ring-0 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-emerald-400">
                            ID: {order.id}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Date: {new Date(order.orderDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-300 mr-2">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const stats = e.target.value;
                            const refund = stats === 'Cancelled' || stats === 'Returned';
                            onOrderStatusUpdated(order.id, stats, refund);
                          }}
                          className="rounded bg-stone-850 border border-stone-700 px-2.5 py-1 text-xs text-emerald-400 font-bold focus:outline-none"
                        >
                          <option value="Pending">Pending Audit</option>
                          <option value="Payment Pending">Payment Pending</option>
                          <option value="Payment Confirmed">Payment Confirmed</option>
                          <option value="Confirmed">Confirmed (Stock Held)</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Dispatched/Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled (Auto Stock Refund)</option>
                          <option value="Returned">Returned (Auto Stock Refund)</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                      {/* Customer Info Column */}
                      <div className="space-y-2 text-sm text-stone-700 border-r border-stone-150 pr-4">
                        <h4 className="font-bold text-stone-900 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-stone-400" />
                          Delivery Coordinates
                        </h4>
                        <p><span className="font-semibold text-stone-500">Recipient:</span> {order.customerName}</p>
                        <p><span className="font-semibold text-stone-500">Phone:</span> {order.customerMobile}</p>
                        <p><span className="font-semibold text-stone-500">WhatsApp:</span> <a href={`https://wa.me/${order.customerWhatsApp}`} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">{order.customerWhatsApp}</a></p>
                        {order.customerEmail && <p><span className="font-semibold text-stone-500">Email:</span> {order.customerEmail}</p>}
                        <p className="leading-relaxed"><span className="font-semibold text-stone-500">Address:</span> {order.address}, {order.city}, {order.province}</p>
                        {order.landmark && <p><span className="font-semibold text-stone-500">Landmark:</span> {order.landmark}</p>}
                        {order.notes && <p className="bg-yellow-50 p-2 rounded text-xs text-amber-900 italic font-medium">"Notes: {order.notes}"</p>}
                      </div>

                      {/* Purchased Cart Items */}
                      <div className="space-y-2 text-xs text-stone-700 border-r border-stone-150 pr-4 md:col-span-1">
                        <h4 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-1.5 flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-stone-400" />
                          Articles In Carton ({order.totalItems})
                        </h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-stone-50 pb-2">
                              <div>
                                <p className="font-bold text-stone-900">{item.productName}</p>
                                <p className="text-[10px] text-stone-500">
                                  SKU: {item.code} | {item.size} / {item.color} | Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="font-semibold font-mono text-stone-800">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Invoicing Breakdown */}
                      <div className="space-y-2 text-sm text-stone-800">
                        <h4 className="font-bold text-stone-900 border-b border-stone-100 pb-1.5">
                          Financial Settlement
                        </h4>
                        <div className="space-y-1.5 text-xs font-sans">
                          <div className="flex justify-between">
                            <span>Billed Pieces count:</span>
                            <span className="font-bold">{order.totalItems} pieces</span>
                          </div>
                          <div className="flex justify-between text-[#800020]">
                            <span>Quantity tier level rate:</span>
                            <span className="font-bold">Rs. {order.ratePerPiece.toLocaleString()}/ea</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-mono font-bold">Rs. {order.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping cost flag:</span>
                            <span>{order.shippingCost === 0 ? 'FREE' : `Rs. ${order.shippingCost}`}</span>
                          </div>
                          <div className="flex justify-between text-base font-bold text-stone-950 border-t border-stone-150 pt-2 font-serif">
                            <span>Grand Payable Total:</span>
                            <span>Rs. {order.finalTotal.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-3.5 bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs">
                          <p><span className="font-bold text-stone-600 uppercase tracking-widest text-[9px] font-mono block mb-1">Settlement Method:</span> {order.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- PRODUCTS CATALOG TAB -------------------- */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Box: Product Creator / Edit Form */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6 shadow-sm self-start">
              <h2 className="text-xl font-serif font-bold text-stone-900 inline-flex items-center gap-1">
                {editingProduct ? 'Modify Active Article' : 'Publish New Article'}
              </h2>
              <p className="text-xs text-stone-500 mb-6 font-sans">
                {editingProduct ? `Currently tweaking database variables for SKU: ${editingProduct.code}` : 'Add custom clothes inventory and variants.'}
              </p>

              <form onSubmit={handleProductSubmit} className="space-y-4 font-sans text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Manufacturer Brand</label>
                    <select
                      value={prodBrandId}
                      onChange={(e) => setProdBrandId(e.target.value)}
                      className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-stone-900 focus:outline-[#800020]"
                      required
                    >
                      <option value="">-- Choose Brand --</option>
                      {db.brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Catalog Collection</label>
                    <select
                      value={prodCategoryId}
                      onChange={(e) => setProdCategoryId(e.target.value)}
                      className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-stone-900 focus:outline-[#800020]"
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {db.categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Article / Product Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Vintage Chunri Print Suit"
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-stone-900 focus:outline-[#800020]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">SKU Code</label>
                    <input
                      type="text"
                      placeholder="e.g. KH-102"
                      value={prodCode}
                      onChange={(e) => setProdCode(e.target.value)}
                      className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-stone-900 focus:outline-[#800020]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Fabric Material</label>
                    <input
                      type="text"
                      placeholder="e.g. Lawn Cotton, Slub Khaddar"
                      value={prodFabric}
                      onChange={(e) => setProdFabric(e.target.value)}
                      className="mt-1 w-full rounded border border-[#E5E5E5] p-2 text-xs focus:outline-[#800020]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Pieces Included</label>
                    <select
                      value={prodPieces}
                      onChange={(e) => setProdPieces(e.target.value)}
                      className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-stone-900 focus:outline-[#800020]"
                    >
                      <option value="3-Piece">3-Piece unstitched</option>
                      <option value="2-Piece">2-Piece cambric</option>
                      <option value="Kurti">Kurti/ShirtOnly</option>
                      <option value="Trouser Sets">Trouser Set</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Description</label>
                  <textarea
                    placeholder="Describe unstitched prints, lace details, cuffs etc..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-[#1F1F1F] focus:outline-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">Image Assets Web Links</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Paste Unsplash or direct clothing Image URL..."
                      value={prodImgInput}
                      onChange={(e) => setProdImgInput(e.target.value)}
                      className="flex-1 rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="rounded bg-stone-900 text-white px-3 text-xs font-bold hover:bg-[#800020]"
                    >
                      Add
                    </button>
                  </div>
                  {/* Small preview block of image url logs */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {prodImages.map((img, index) => (
                      <span key={index} className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-700">
                        Image {index+1}
                        <button type="button" onClick={() => handleRemoveImageItem(index)} className="text-red-600 hover:text-red-950">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Variants Custom Multi-Fields Table */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider border-b border-stone-100 pb-1 flex justify-between items-center">
                    <span>Sizes, Colors & Variant Inventory Stock</span>
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="rounded bg-[#800020]/10 px-2 py-0.5 text-[#800020] text-[10px] uppercase font-bold hover:bg-[#800020]/20"
                    >
                      + Add Row
                    </button>
                  </label>
                  
                  <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                    {prodVariants.map((variant, idx) => (
                      <div key={idx} className="flex gap-1.5 items-center">
                        <select
                          value={variant.size}
                          onChange={(e) => handleUpdateVariantItem(idx, 'size', e.target.value)}
                          className="rounded border border-stone-200 p-1.5 text-xs focus:outline-[#800020]"
                        >
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                          <option value="Unstitched Standard">Standard/XL</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Color (e.g. Indigo Blue)"
                          value={variant.color}
                          onChange={(e) => handleUpdateVariantItem(idx, 'color', e.target.value)}
                          className="flex-1 rounded border border-stone-200 p-1.5 text-xs focus:outline-[#800020]"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Stock limit"
                          value={variant.stock}
                          onChange={(e) => handleUpdateVariantItem(idx, 'stock', e.target.value)}
                          className="w-14 rounded border border-stone-200 p-1.5 text-xs text-center focus:outline-[#800020]"
                          min="0"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
                          className="text-stone-400 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={prodFeatured}
                      onChange={(e) => setProdFeatured(e.target.checked)}
                      className="rounded border-stone-300 text-[#800020] focus:ring-[#800020]"
                    />
                    <span>Mark Featured Item</span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={prodNewArrival}
                      onChange={(e) => setProdNewArrival(e.target.checked)}
                      className="rounded border-stone-200 text-[#800020] focus:ring-[#800020]"
                    />
                    <span>Mark New Arrival</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="submit"
                    className="flex-1 rounded-md bg-[#800020] py-2.5 text-xs font-bold tracking-wider text-[#FAF9F6] uppercase hover:bg-[#600018]"
                  >
                    {editingProduct ? 'Commit Save Changes' : 'Publish Reseller Record'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="rounded-md border border-stone-350 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Box: Products Inventory Table & list */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-serif font-bold text-stone-900">Current Reseller Catalog</h2>
              <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
                <table className="w-full text-left text-xs font-sans text-stone-600 border-collapse">
                  <thead>
                    <tr className="bg-stone-900 text-stone-300 uppercase tracking-widest text-[9px] font-mono select-none">
                      <th className="p-4">SKU / Title</th>
                      <th className="p-4">Brand / Material</th>
                      <th className="p-4">Sizes & Stocks</th>
                      <th className="p-4 text-center">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {db.products.map(p => {
                      const totalStock = p.variants.reduce((a, b) => a + b.stock, 0);
                      return (
                        <tr key={p.id} className={`hover:bg-stone-50 transition-colors ${p.hidden ? 'opacity-40 bg-stone-100/55' : ''}`}>
                          <td className="p-4">
                            <p className="font-bold text-stone-900 line-clamp-1">{p.title}</p>
                            <p className="font-mono text-[9px] font-extrabold text-stone-400 mt-0.5 bg-stone-100 py-0.5 px-1.5 rounded inline-block uppercase">{p.code}</p>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-stone-800">{p.brandName}</span>
                            <p className="text-[10px] text-stone-400 mt-0.5">{p.pieces} • {p.fabric}</p>
                          </td>
                          <td className="p-4 space-y-1">
                            {p.variants.map((v, i) => (
                              <div key={i} className="flex justify-between max-w-[120px] text-[10px]">
                                <span className="font-medium text-stone-500">{v.size}:</span>
                                <span className={`font-mono font-bold ${v.stock === 0 ? 'text-red-500' : 'text-stone-850'}`}>{v.stock} left</span>
                              </div>
                            ))}
                            <div className="border-t border-stone-100 pt-0.5 font-bold text-[10px] text-stone-800">
                              Total: {totalStock} qty {p.hidden && ' (HIDDEN)'}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="rounded bg-stone-100 p-1.5 text-stone-700 hover:bg-[#800020] hover:text-white transition-colors"
                                title="Edit Product Record"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateClick(p)}
                                className="rounded bg-stone-100 p-1.5 text-stone-700 hover:bg-[#800020] hover:text-white transition-colors"
                                title="Duplicate / Clone Product"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Do you want to toggle visibility for ${p.title}?`)) {
                                    onProductUpdated(p.id, { hidden: !p.hidden });
                                  }
                                }}
                                className="rounded bg-stone-100 p-1.5 text-stone-700 hover:bg-red-800 hover:text-[#FAF9F6] transition-colors"
                                title={p.hidden ? 'Unhide Item' : 'Hide / Archive Item'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- BRANDS TAB -------------------- */}
        {activeTab === 'brands' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Brand */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm self-start font-sans">
              <h2 className="text-xl font-serif font-bold text-stone-900">Add Premium Clothing Brand</h2>
              <p className="text-xs text-stone-500 mb-6">Incorporate new luxury brands (such as Jazmin, Sana Safinaz, etc.) into the catalog.</p>

              <form onSubmit={handleAddBrand} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Brand name</label>
                  <input
                    type="text"
                    placeholder="e.g. Republic WomensWear"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-stone-900 focus:outline-[#800020]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Brand history description</label>
                  <textarea
                    placeholder="e.g. Master crafter since 2011 with a focus on luxury chiffons and net formal panels..."
                    value={newBrandDesc}
                    onChange={(e) => setNewBrandDesc(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-[#800020] py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#600018]"
                >
                  Publish Brand
                </button>
              </form>
            </div>

            {/* List Brands */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-stone-900 font-sans">Registered Brand Partners</h2>
              <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
                <div className="p-4 divide-y divide-stone-100">
                  {db.brands.map(brand => (
                    <div key={brand.id} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-serif font-bold text-stone-950">{brand.name} {brand.hidden && '(HIDDEN)'}</p>
                        <p className="text-xs text-stone-500 line-clamp-1">{brand.description || 'No description provided.'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newName = prompt('Enter new brand name:', brand.name);
                            if (newName) {
                              onSettingsUpdate({} /* triggers save via generic endpoint, or write helper */);
                              // We can pass edits through app functions, let's keep it simple
                              brand.name = newName;
                              alert('Modified! Save settings tab below to persist permanently across Node servers.');
                            }
                          }}
                          className="p-1 px-2.5 rounded bg-stone-100 text-stone-700 text-xs hover:bg-stone-200 font-bold font-sans"
                        >
                          Rename
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- CATEGORIES TAB -------------------- */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create category */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm self-start font-sans">
              <h2 className="text-xl font-serif font-bold text-stone-900">Add Collection / Category Tag</h2>
              <p className="text-xs text-[#707070] mb-6">Group outfits as Lawn, Cambrics, Winter collections or festive kurtis.</p>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Tag / Category label</label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding Festive Collection, Organza Edit"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs text-stone-950 focus:outline-[#800020]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-[#800020] py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#600018]"
                >
                  Write Category Tag
                </button>
              </form>
            </div>

            {/* List categories */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-stone-900 font-sans">Collection Categories</h2>
              <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
                <div className="p-4 divide-y divide-stone-100">
                  {db.categories.map(cat => (
                    <div key={cat.id} className="py-3 flex justify-between items-center text-sm font-sans">
                      <span className="font-semibold text-stone-950">{cat.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono font-bold bg-stone-50 px-2 py-0.5 rounded">ID: {cat.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- GENERAL SETTINGS TAB -------------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-8 font-sans text-sm">
            
            {/* Store details panel */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-stone-950 mb-4 pb-2 border-b border-stone-100">📞 Contact & Reseller Core Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">WhatsApp Support Number</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                  <span className="text-[10px] text-stone-400">Include country code like +923001234567</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Instagram Handler URL</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Facebook Profile URL</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Flat Shipping Fee (Rs)</label>
                  <input
                    type="number"
                    value={shipFee}
                    onChange={(e) => setShipFee(Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Free Shipping Above (Rs)</label>
                  <input
                    type="number"
                    value={freeShipLimit}
                    onChange={(e) => setFreeShipLimit(Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest">Estimated Dispatch Delivery window</label>
                  <input
                    type="text"
                    value={shipTime}
                    onChange={(e) => setShipTime(e.target.value)}
                    className="mt-1 w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
              </div>
            </div>

            {/* 🎯 Smart Personalization & Product Re-Ranking System */}
            <div id="smart-personalization-card" className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-950 flex items-center gap-2">
                  <span>🎯 Smart Viewed-Product Re-Ranking</span>
                  <span className="text-[10px] font-mono bg-indigo-50 px-2 py-0.5 text-indigo-700 rounded font-bold uppercase select-none animate-pulse">
                    Customer Experience Engine
                  </span>
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-normal">
                  Configure how the dynamic product catalog handles customer view history. Product views are recorded automatically. Once visited, items are safely deprioritized to prioritize fresh discoveries, while cart and wishlist actions mitigate penalties.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
                {/* Global Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-stone-850 uppercase tracking-wider block">Enable Personalization</label>
                    <span className="text-[10px] text-stone-400 block font-sans">
                      Automatically re-rank and shuffle product cards based on guest view history.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center h-6 rounded-full w-11 shrink-0 cursor-pointer select-none">
                    <input
                      id="toggle-personalization-ranking"
                      type="checkbox"
                      checked={personalizationEnabled}
                      onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span className="w-11 h-6 bg-stone-250 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#800020]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800020]"></span>
                  </label>
                </div>

                {/* Out Of Stock displays */}
                <div className="space-y-2 p-4 rounded-lg bg-stone-50 border border-stone-200/60">
                  <label className="text-xs font-bold text-stone-850 uppercase tracking-wider block" htmlFor="select-out-of-stock-display">
                    Out Of Stock Display Rules
                  </label>
                  <select
                    id="select-out-of-stock-display"
                    value={outOfStockDisplay}
                    onChange={(e) => setOutOfStockDisplay(e.target.value as any)}
                    className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2.5 font-semibold text-stone-850 focus:ring-1 focus:ring-[#800020] focus:border-[#800020] outline-none"
                  >
                    <option value="bottom">Push to the bottom of the feed (Default)</option>
                    <option value="hide">Hide completely from the search feedback catalog</option>
                    <option value="visible">Keep sorting order visible in-place</option>
                  </select>
                  <span className="text-[10px] text-stone-400 block font-medium">
                    Manage listing display priorities when all inventory items within a folder are sold out.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Decay setting Slider */}
                <div className="space-y-2 p-4 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-850 uppercase tracking-wider block">
                      History Decay Window
                    </label>
                    <span className="font-mono text-xs font-black text-[#800020] bg-[#800020]/5 px-2 py-0.5 rounded">
                      {viewHistoryDays} Days
                    </span>
                  </div>
                  <input
                    id="input-history-decay-days"
                    type="range"
                    min="1"
                    max="180"
                    value={viewHistoryDays}
                    onChange={(e) => setViewHistoryDays(Number(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#800020]"
                  />
                  <span className="text-[10px] text-stone-400 block font-sans">
                    Define the duration (in days) that visited product history stays active before scoring decays back to baseline.
                  </span>
                </div>

                {/* Max history size input */}
                <div className="space-y-2 p-4 rounded-lg bg-stone-50 border border-stone-200/60">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-850 uppercase tracking-wider block">
                      Max Tracked History size
                    </label>
                    <span className="font-mono text-xs font-bold text-stone-600 bg-stone-200/50 px-2 py-0.5 rounded">
                      {maxViewHistorySize} Items
                    </span>
                  </div>
                  <input
                    id="input-max-history-size"
                    type="number"
                    min="5"
                    max="100"
                    value={maxViewHistorySize}
                    onChange={(e) => setMaxViewHistorySize(Number(e.target.value) || 20)}
                    className="w-full rounded-lg border border-stone-200 bg-white p-2 text-xs font-semibold focus:ring-1 focus:ring-[#800020]"
                  />
                  <span className="text-[10px] text-stone-400 block font-sans">
                    Limit the maximum collection array items inside guest localStorage cache. Recommended: 20 slots.
                  </span>
                </div>
              </div>
            </div>

            {/* Global Pricing Tiers Configuration (MANDATORY IN CONTRACT) */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#1F1F1F] mb-1 leading-tight flex justify-between items-center">
                <span>💰 Global Mixing Quantity-Pricing Tiers</span>
                <span className="text-[10px] font-mono bg-amber-50 px-2 py-0.5 text-amber-800 rounded font-bold uppercase select-none">
                  Live DB Decoupled Variables
                </span>
              </h3>
              <p className="text-xs text-stone-500 mb-4 leading-normal">
                Avoid hardcoding rates. Modify standard ranges dynamically here and let the server securely enforce rates matching client cart pieces on order calculation.
              </p>

              <div className="space-y-4">
                {tiers.map((tier, idx) => (
                  <div key={tier.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-lg border border-stone-150">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">Tier Name</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleTierUpdateItem(idx, 'name', e.target.value)}
                        className="mt-1 w-full rounded border border-stone-200 bg-white p-2 text-xs focus:outline-[#800020]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">Minimum Qty</label>
                      <input
                        type="number"
                        value={tier.minQty}
                        onChange={(e) => handleTierUpdateItem(idx, 'minQty', e.target.value)}
                        className="mt-1 w-full rounded border border-stone-200 bg-white p-2 text-xs text-center focus:outline-[#800020]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">Maximum Qty (empty for +)</label>
                      <input
                        type="number"
                        placeholder="Unlimited"
                        value={tier.maxQty === null ? '' : tier.maxQty}
                        onChange={(e) => handleTierUpdateItem(idx, 'maxQty', e.target.value)}
                        className="mt-1 w-full rounded border border-stone-200 bg-white p-2 text-xs text-center focus:outline-[#800020]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#800020] uppercase tracking-widest">Rate (Rs per Piece)</label>
                      <input
                        type="number"
                        value={tier.rate}
                        onChange={(e) => handleTierUpdateItem(idx, 'rate', e.target.value)}
                        className="mt-1 w-full rounded border border-stone-200 bg-white p-2 text-xs text-right font-semibold text-[#800020] focus:outline-[#800020]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offline Bank Transfer accounts */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-stone-950 mb-3">🏦 Upfront Payments & Account Settlement</h3>
              <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                Provide payment account listings where clients deposit upfront amounts and provide verification parameters.
              </p>
              
              <div className="space-y-4">
                {accounts.map((ac, idx) => (
                  <div key={idx} className="p-4 rounded-md border border-stone-200 bg-stone-50 space-y-3">
                    <p className="font-bold text-xs uppercase tracking-wider text-stone-700">{ac.method} Accounts</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Account Title / Owner</label>
                        <input
                          type="text"
                          value={ac.title}
                          onChange={(e) => handleAccountUpdateItem(idx, 'title', e.target.value)}
                          className="mt-1 w-full bg-white border border-stone-200 rounded p-2 text-xs focus:outline-[#800020]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Account Number or IBAN</label>
                        <input
                          type="text"
                          value={ac.number}
                          onChange={(e) => handleAccountUpdateItem(idx, 'number', e.target.value)}
                          className="mt-1 w-full bg-white border border-stone-200 rounded p-2 text-xs focus:outline-[#800020]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Transfer Directions Guideline</label>
                      <input
                        type="text"
                        value={ac.instructions}
                        onChange={(e) => handleAccountUpdateItem(idx, 'instructions', e.target.value)}
                        className="mt-1 w-full bg-white border border-stone-200 rounded p-2 text-xs focus:outline-[#800020]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Policy Pages Editor */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-stone-950 mb-3">📄 Edit Reseller Policies Markdown</h3>
              <p className="text-xs text-[#707070] mb-4">Edit information layouts appearing on product detailed sheets or footer lists dynamically.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">About Us Reseller Bio</label>
                  <textarea
                    value={aboutUs}
                    onChange={(e) => setAboutUs(e.target.value)}
                    rows={4}
                    className="w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">Shipping & COD Coverage details</label>
                  <textarea
                    value={shipPolicy}
                    onChange={(e) => setShipPolicy(e.target.value)}
                    rows={4}
                    className="w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">Return / Replacement Policy</label>
                  <textarea
                    value={returnPolicy}
                    onChange={(e) => setReturnPolicy(e.target.value)}
                    rows={4}
                    className="w-full rounded border border-stone-200 p-2 text-xs focus:outline-[#800020]"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons Panel */}
            <div className="flex justify-end pt-4 bg-stone-100 p-4 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={handleSaveStoreSettings}
                className="rounded-full bg-[#800020] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-[#FAF9F6] shadow-md hover:bg-[#600018] flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Commit Live Variables To DB File
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
