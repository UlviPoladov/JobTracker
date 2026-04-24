import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await register(form);
      authLogin(data);
      navigate('/');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100
                    flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-600
                          rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl">💼</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">JobTracker</h1>
          <p className="text-gray-500 text-sm mt-1">Start tracking your job search</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Create account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl
                            text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {(['fullName', 'email', 'password'] as const).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key === 'fullName' ? 'Full name' : key}
                </label>
                <input
                  type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-violet-600 text-white rounded-xl text-sm
                         font-medium hover:bg-violet-700 transition disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}