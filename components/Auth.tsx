import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, User, Mail } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay for auth
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-cyber-500/10 rounded-2xl border border-cyber-500/20 mb-4">
            <ShieldCheck className="h-10 w-10 text-cyber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-tight">
            PROFILE <span className="text-cyber-500">CHECKER</span>
          </h1>
          <p className="text-gray-400 mt-2">Secure Social Identity Protection</p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel p-8 rounded-2xl shadow-2xl shadow-black/50 border-cyber-700/50 backdrop-blur-xl relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-xl font-semibold text-white mb-6 relative z-10">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-cyber-900/50 border border-cyber-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 transition-all placeholder-gray-600"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <input 
                  type="email" 
                  required 
                  className="w-full bg-cyber-900/50 border border-cyber-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 transition-all placeholder-gray-600"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <input 
                  type="password" 
                  required 
                  className="w-full bg-cyber-900/50 border border-cyber-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyber-600 to-cyber-500 hover:from-cyber-500 hover:to-cyber-400 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-cyber-500/25 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center mt-6"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
        
        <p className="text-center text-xs text-cyber-700 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;