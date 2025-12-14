import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Analyzer from './components/Analyzer';
import Results from './components/Results';
import Auth from './components/Auth';
import { AnalysisResult } from './types';
import { Shield, Eye, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleAnalysisComplete = (data: AnalysisResult) => {
    setResult(data);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not logged in, show Auth page
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-cyber-900 text-gray-200 font-sans selection:bg-cyber-500 selection:text-white">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyber-800/50 to-transparent pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {!result && (
            <div className="text-center mb-16 space-y-6 animate-fade-in-up">
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 pt-8">
                Is Your Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 to-cyber-success">Safe?</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg text-gray-400">
                Hackers use visible information to social engineer attacks. Enter your profile link to get an instant AI security audit based on public data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12 text-left">
                <FeatureCard 
                  icon={<Eye className="w-6 h-6 text-cyber-400" />}
                  title="Link Analysis"
                  desc="Checks for phishing patterns and suspicious URL structures."
                />
                <FeatureCard 
                  icon={<Shield className="w-6 h-6 text-cyber-400" />}
                  title="Reputation Scan"
                  desc="Searches public records for reports of compromise or scams."
                />
                <FeatureCard 
                  icon={<Lock className="w-6 h-6 text-cyber-400" />}
                  title="Privacy First"
                  desc="We don't display your personal data. We only show safety risks."
                />
              </div>
            </div>
          )}

          <div className="transition-all duration-500">
            {result ? (
              <Results result={result} onReset={handleReset} />
            ) : (
              <Analyzer 
                onAnalysisComplete={handleAnalysisComplete} 
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            )}
          </div>

        </main>

        <footer className="border-t border-cyber-800 bg-cyber-900/50 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p className="mb-2">© {new Date().getFullYear()} Profile Checker. For educational purposes only.</p>
            <p>This tool uses AI to estimate risk based on public data. It cannot detect backend breaches.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-xl bg-cyber-800/30 border border-cyber-700/50 backdrop-blur-sm hover:border-cyber-500/50 transition-colors">
    <div className="mb-4 p-3 bg-cyber-900 rounded-lg inline-block border border-cyber-700">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

export default App;