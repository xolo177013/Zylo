import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success('Logged in successfully');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <div className="card p-8 animate-scaleIn">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white mb-4 shadow-soft">
          <LogIn size={20} />
        </div>
        <h1 className="text-xl font-display font-bold text-ink-900 mb-1">Welcome back</h1>
        <p className="text-sm text-ink-400 mb-6">Log in for your orders, wishlist and picks made just for you.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="input-field"
          />
          <button type="submit" disabled={submitting} className="btn-brand w-full !py-2.5">
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-ink-500 mt-6 text-center">
          New to Zylo?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
            Create an account
          </Link>
        </p>

        <div className="mt-6 border-t border-ink-100 pt-4 text-xs text-ink-400">
          Demo accounts (after running <code className="bg-ink-100 px-1 rounded">npm run seed</code>):
          <br />Admin: admin@zylo.test / admin123
          <br />Customer: customer@zylo.test / customer123
        </div>
      </div>
    </div>
  );
}
