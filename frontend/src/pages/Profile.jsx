import { useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateMeApi } from '../api/authService';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [address, setAddress] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: ''
  });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateMeApi(form);
      setUser((prev) => ({ ...prev, ...data }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const existing = user.addresses || [];
      const { data } = await updateMeApi({ addresses: [...existing, address] });
      setUser((prev) => ({ ...prev, ...data }));
      setAddress({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message || 'Could not add address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="card p-6 animate-fadeInUp">
        <h1 className="text-lg font-display font-bold text-ink-900 mb-4">My Profile</h1>
        <form onSubmit={handleProfileSave} className="space-y-3 max-w-md">
          <div>
            <label className="text-xs text-ink-400">Email</label>
            <input value={user?.email} disabled className="input-field bg-ink-50 text-ink-400" />
          </div>
          <div>
            <label className="text-xs text-ink-400">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-ink-400">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-brand !px-5 !py-2">
            Save Changes
          </button>
        </form>
      </div>

      <div className="card p-6 animate-fadeInUp">
        <h2 className="text-lg font-display font-bold text-ink-900 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-brand-600" /> Saved Addresses
        </h2>
        {(user?.addresses || []).length === 0 ? (
          <p className="text-sm text-ink-400 mb-4">No saved addresses yet.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {user.addresses.map((a) => (
              <div key={a._id} className="border border-ink-100 rounded-xl p-3.5 text-sm text-ink-600 bg-ink-50/50">
                {a.fullName} &middot; {a.phone}
                <br />
                {a.line1}, {a.city}, {a.state} - {a.pincode}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input required placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))} className="input-field" />
          <input required placeholder="Phone" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} className="input-field" />
          <input required placeholder="Address Line 1" value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} className="input-field sm:col-span-2" />
          <input placeholder="Address Line 2" value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} className="input-field sm:col-span-2" />
          <input required placeholder="City" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className="input-field" />
          <input required placeholder="State" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} className="input-field" />
          <input required placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))} className="input-field" />
          <button type="submit" disabled={saving} className="btn-brand sm:col-span-2">
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
}
