import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, Smartphone, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrderApi } from '../api/orderService';

const emptyAddress = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export default function Checkout() {
  const { items, subtotal, refreshCart } = useCart();
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState('MOCK_CARD');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const shipping = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleChange = (field) => (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setPlacing(true);
    try {
      const { success, data, message } = await createOrderApi({ shippingAddress: address, paymentMethod });
      await refreshCart();
      if (success) {
        toast.success('Payment successful! Order confirmed.');
        navigate(`/orders/${data._id}`);
      } else {
        toast.error(message || 'Payment failed');
        navigate(`/orders/${data._id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  const paymentOptions = [
    { value: 'MOCK_CARD', label: 'Credit / Debit Card (Mock)', icon: CreditCard },
    { value: 'MOCK_UPI', label: 'UPI (Mock)', icon: Smartphone },
    { value: 'COD', label: 'Cash on Delivery', icon: Truck }
  ];

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-ink-400 mb-4">Your cart is empty. Add some products before checking out.</p>
        <button onClick={() => navigate('/products')} className="btn-brand">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
        {/* Shipping address */}
        <div className="card p-6 animate-fadeInUp">
          <h2 className="font-display font-bold text-ink-900 mb-4 flex items-center gap-2">
            <Truck size={18} className="text-brand-600" /> Shipping Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Full Name" value={address.fullName} onChange={handleChange('fullName')} className="input-field" />
            <input required placeholder="Phone Number" value={address.phone} onChange={handleChange('phone')} className="input-field" />
            <input required placeholder="Address Line 1" value={address.line1} onChange={handleChange('line1')} className="input-field sm:col-span-2" />
            <input placeholder="Address Line 2 (optional)" value={address.line2} onChange={handleChange('line2')} className="input-field sm:col-span-2" />
            <input required placeholder="City" value={address.city} onChange={handleChange('city')} className="input-field" />
            <input required placeholder="State" value={address.state} onChange={handleChange('state')} className="input-field" />
            <input required placeholder="Pincode" value={address.pincode} onChange={handleChange('pincode')} className="input-field" />
          </div>
        </div>

        {/* Payment method */}
        <div className="card p-6 animate-fadeInUp">
          <h2 className="font-display font-bold text-ink-900 mb-4">Payment Method</h2>
          <div className="space-y-2">
            {paymentOptions.map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer transition-all duration-200 ${
                  paymentMethod === value ? 'border-brand-400 bg-brand-50' : 'border-ink-200 hover:border-brand-200'
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                  className="accent-brand-600"
                />
                <Icon size={18} className="text-ink-500" /> {label}
              </label>
            ))}
          </div>
          <p className="text-xs text-ink-400 mt-3">
            This uses a simulated payment gateway - no real payment details are collected or charged.
          </p>
        </div>

        <button type="submit" disabled={placing} className="btn-accent w-full !py-3">
          {placing ? 'Processing Payment...' : `Place Order & Pay ₹${total.toLocaleString('en-IN')}`}
        </button>
      </form>

      {/* Order summary */}
      <div className="card p-6 h-fit animate-fadeInUp">
        <h2 className="font-display font-bold text-ink-900 mb-4">Order Summary</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin mb-4">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-ink-500 line-clamp-1">
                {item.product?.title} x {item.quantity}
              </span>
              <span className="text-ink-800 font-semibold">
                ₹{(item.priceAtAddTime * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-100 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-ink-500">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-ink-500">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>
          <div className="flex justify-between text-ink-500">
            <span>Tax (5%)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-bold text-ink-900 text-base border-t border-ink-100 pt-2 mt-2">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
