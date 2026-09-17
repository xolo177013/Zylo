import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { getMyOrdersApi } from '../api/orderService';

const statusColor = {
  Placed: 'bg-ink-100 text-ink-600',
  Confirmed: 'bg-brand-100 text-brand-700',
  Shipped: 'bg-amber-100 text-amber-700',
  'Out for Delivery': 'bg-accent-100 text-accent-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrdersApi()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-display font-bold text-ink-900 mb-4">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-28" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-14 text-center text-ink-400 flex flex-col items-center gap-3">
          <PackageSearch size={36} className="text-ink-200" />
          <p>
            You haven't placed any orders yet.{' '}
            <Link to="/products" className="text-brand-600 font-semibold">
              Start shopping
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block card p-4 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 animate-fadeInUp"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="text-sm text-ink-400">
                    Order #{order._id.slice(-8).toUpperCase()} &middot;{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-ink-700 mt-1 font-medium">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''} &middot; ₹{order.totalPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`pill ${statusColor[order.orderStatus] || 'bg-ink-100 text-ink-600'}`}>
                    {order.orderStatus}
                  </span>
                  <span
                    className={`pill ${
                      order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {order.items.slice(0, 5).map((item, idx) => (
                  <img key={idx} src={item.image} alt={item.title} className="w-12 h-12 object-contain bg-ink-50 border border-ink-100 rounded-lg" />
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
