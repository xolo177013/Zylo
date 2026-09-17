import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LayoutDashboard } from 'lucide-react';
import api from '../api/axios';

const emptyProduct = {
  title: '', description: '', brand: '', category: '', price: '', mrp: '', stock: '', images: ''
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    const { data } = await api.get('/products', { params: { limit: 50 } });
    setProducts(data.data);
  };

  const loadOrders = async () => {
    const { data } = await api.get('/orders', { params: { limit: 50 } });
    setOrders(data.data);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadProducts(), loadOrders()]).finally(() => setLoading(false));
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        images: form.images.split(',').map((s) => s.trim()).filter(Boolean)
      });
      toast.success('Product created');
      setForm(emptyProduct);
      loadProducts();
    } catch (err) {
      toast.error(err.message || 'Could not create product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deactivated');
      loadProducts();
    } catch (err) {
      toast.error(err.message || 'Could not delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      loadOrders();
    } catch (err) {
      toast.error(err.message || 'Could not update order');
    }
  };

  const statusOptions = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-display font-bold text-ink-900 mb-4 flex items-center gap-2">
        <LayoutDashboard size={22} className="text-brand-600" /> Admin Dashboard
      </h1>

      <div className="flex gap-2 mb-6 bg-ink-100/70 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
            tab === 'products' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
            tab === 'orders' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          Orders
        </button>
      </div>

      {tab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="card p-6 lg:col-span-1 h-fit">
            <h2 className="font-display font-bold text-ink-900 mb-4">Add New Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" />
              <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field" rows={3} />
              <input placeholder="Brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="input-field" />
              <input required placeholder="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-field" />
              <div className="flex gap-2">
                <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input-field w-1/2" />
                <input required type="number" placeholder="MRP" value={form.mrp} onChange={(e) => setForm((f) => ({ ...f, mrp: e.target.value }))} className="input-field w-1/2" />
              </div>
              <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input-field" />
              <input required placeholder="Image URL(s), comma separated" value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))} className="input-field" />
              <button type="submit" disabled={saving} className="btn-brand w-full">
                {saving ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4 flex items-center gap-4">
                <img src={p.images?.[0]} alt={p.title} className="w-14 h-14 object-contain bg-ink-50 border border-ink-100 rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-800">{p.title}</p>
                  <p className="text-xs text-ink-400">
                    {p.category} &middot; ₹{p.price} &middot; Stock: {p.stock}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(p._id)}
                  className="text-xs font-semibold text-accent-600 border border-accent-200 rounded-lg px-3 py-1.5 hover:bg-accent-50 transition-colors"
                >
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-3 animate-fadeIn">
          {orders.map((order) => (
            <div key={order._id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink-800">
                  #{order._id.slice(-8).toUpperCase()} &middot; {order.user?.name} ({order.user?.email})
                </p>
                <p className="text-xs text-ink-400">
                  ₹{order.totalPrice.toLocaleString('en-IN')} &middot; Payment: {order.paymentStatus} &middot; Status: {order.orderStatus}
                </p>
              </div>
              <select
                value={order.orderStatus}
                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                className="border border-ink-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 transition-colors"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
