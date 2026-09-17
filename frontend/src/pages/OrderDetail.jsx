import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrderByIdApi, retryPaymentApi } from '../api/orderService';

const trackingSteps = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const { data } = await getOrderByIdApi(orderId);
      setOrder(data);
    } catch (err) {
      toast.error(err.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleRetryPayment = async () => {
    setRetrying(true);
    try {
      const { success, message } = await retryPaymentApi(orderId);
      success ? toast.success(message) : toast.error(message);
      loadOrder();
    } catch (err) {
      toast.error(err.message || 'Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="skeleton h-52" />
        <div className="skeleton h-40" />
      </div>
    );
  }
  if (!order) return <p className="text-center py-16 text-ink-400">Order not found.</p>;

  const currentStepIndex = trackingSteps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="card p-6 animate-fadeInUp">
        <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
          <div>
            <h1 className="text-lg font-display font-bold text-ink-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-ink-400">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
          <span
            className={`pill ${
              order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            Payment: {order.paymentStatus}
          </span>
        </div>

        {order.paymentStatus !== 'Paid' && !isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-red-700">Payment was not completed for this order.</p>
            <button onClick={handleRetryPayment} disabled={retrying} className="btn-accent !py-2 !px-4">
              {retrying ? 'Processing...' : 'Retry Payment'}
            </button>
          </div>
        )}

        {/* Tracking timeline */}
        {!isCancelled && (
          <div className="flex items-center justify-between mt-6 mb-6">
            {trackingSteps.map((step, idx) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {idx > 0 && (
                  <div
                    className={`absolute top-3 right-1/2 w-full h-0.5 transition-colors duration-500 ${
                      idx <= currentStepIndex ? 'bg-emerald-500' : 'bg-ink-200'
                    }`}
                  />
                )}
                {idx <= currentStepIndex ? (
                  <CheckCircle2 className="text-emerald-500 bg-white z-10" size={24} />
                ) : (
                  <Circle className="text-ink-200 bg-white z-10" size={24} />
                )}
                <span className="text-[11px] text-ink-500 mt-1 text-center">{step}</span>
              </div>
            ))}
          </div>
        )}
        {isCancelled && <p className="text-red-600 font-semibold text-sm mb-4">This order has been cancelled.</p>}

        {/* Status history */}
        <div className="border-t border-ink-100 pt-4">
          <h3 className="text-sm font-semibold text-ink-700 mb-2">Status History</h3>
          <ul className="space-y-1">
            {order.statusHistory.map((h, idx) => (
              <li key={idx} className="text-xs text-ink-400">
                <span className="font-semibold text-ink-700">{h.status}</span> - {h.note} (
                {new Date(h.changedAt).toLocaleString('en-IN')})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Items */}
      <div className="card p-6 animate-fadeInUp">
        <h2 className="font-display font-bold text-ink-900 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-ink-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="w-14 h-14 object-contain bg-ink-50 border border-ink-100 rounded-lg" />
                <div>
                  <p className="text-sm text-ink-800 font-medium">{item.title}</p>
                  <p className="text-xs text-ink-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-ink-500">
            <span>Items</span>
            <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-ink-500">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
          </div>
          <div className="flex justify-between text-ink-500">
            <span>Tax</span>
            <span>₹{order.taxPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-bold text-ink-900 border-t border-ink-100 pt-2">
            <span>Total</span>
            <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="card p-6 animate-fadeInUp">
        <h2 className="font-display font-bold text-ink-900 mb-2">Shipping Address</h2>
        <p className="text-sm text-ink-600 leading-relaxed">
          {order.shippingAddress.fullName} &middot; {order.shippingAddress.phone}
          <br />
          {order.shippingAddress.line1}
          {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
        </p>
      </div>
    </div>
  );
}
