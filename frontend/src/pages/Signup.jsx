import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] to-[#0f172a] px-4 font-sans">
      <div className="w-full max-w-[400px] bg-[#020617] p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Bot className="text-indigo-500" size={28} />
          </div>
          <h2 className="text-[24px] font-semibold text-white mb-2">Create your account</h2>
          <p className="text-[14px] text-slate-400">Start chatting with your documents</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-300 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-[#0f172a] border border-slate-700 rounded-[10px] px-4 text-white text-[15px] placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#0f172a] border border-slate-700 rounded-[10px] px-4 text-white text-[15px] placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 hover:brightness-110 text-white font-medium rounded-[10px] transition-all shadow-sm flex items-center justify-center text-[15px]"
          >
            Sign up
          </button>
        </form>

        <p className="mt-8 text-center text-[14px] text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
