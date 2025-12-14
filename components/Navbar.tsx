import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full border-b border-cyber-700 bg-cyber-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-cyber-500/20 p-2 rounded-lg border border-cyber-500/50">
              <ShieldCheck className="h-6 w-6 text-cyber-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              PROFILE <span className="text-cyber-500">CHECKER</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;