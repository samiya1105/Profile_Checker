import React, { useState } from 'react';
import { Search, AlertCircle, Link, Activity } from 'lucide-react';
import { analyzeProfile } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface AnalyzerProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }) => {
  const [url, setUrl] = useState<string>('');
  const [platform, setPlatform] = useState<string>('Instagram');
  const [context, setContext] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a profile URL.");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      setError("Please enter a valid URL (e.g., https://instagram.com/username).");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeProfile(url, platform, context);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyber-900/50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Activity className="mr-2 text-cyber-500" />
            Start Link Audit
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your social media profile URL. AI will scan public records and the link structure for phishing risks, compromise indicators, and safety gaps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
            <div className="grid grid-cols-3 gap-3">
              {['Instagram', 'Twitter/X', 'LinkedIn', 'Facebook', 'TikTok', 'Other'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    platform === p
                      ? 'bg-cyber-500 text-white shadow-lg shadow-cyber-500/25 border-cyber-400'
                      : 'bg-cyber-800 text-gray-400 border border-cyber-700 hover:border-cyber-500'
                  } border`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* URL Input Area */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Link</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-gray-500 group-focus-within:text-cyber-400 transition-colors" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                }}
                disabled={isAnalyzing}
                placeholder={`https://${platform.toLowerCase()}.com/your_username`}
                className="block w-full pl-10 pr-3 py-4 bg-cyber-900/50 border border-cyber-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyber-500/50 focus:border-cyber-500 transition-all shadow-inner"
              />
              {/* Scanning Animation Line */}
              {isAnalyzing && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-400 animate-pulse-slow rounded-b-xl shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
              )}
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Context (Optional)
              <span className="text-gray-500 text-xs ml-2 font-normal">Mention specific concerns (e.g., "received a login alert")</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., I suspect someone is trying to reset my password..."
              className="w-full bg-cyber-900/50 border border-cyber-700 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyber-500/50 focus:border-cyber-500 transition-all text-sm h-24 resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing || !url}
            className={`w-full py-4 px-6 rounded-lg font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2
              ${isAnalyzing || !url 
                ? 'bg-cyber-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyber-600 to-cyber-500 hover:from-cyber-500 hover:to-cyber-400 hover:shadow-cyber-500/25 active:scale-[0.98]'
              }`}
          >
            {isAnalyzing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                <span>Scanning Public Records...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Run Security Check</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Analyzer;