import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert, ChevronRight, RefreshCw, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

interface ResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onReset }) => {
  
  const isUnknown = result.overallRisk === RiskLevel.UNKNOWN;

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'text-green-400';
      case RiskLevel.MEDIUM: return 'text-yellow-400';
      case RiskLevel.HIGH: return 'text-orange-500';
      case RiskLevel.CRITICAL: return 'text-red-500';
      case RiskLevel.UNKNOWN: return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBg = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'bg-green-500/10 border-green-500/30';
      case RiskLevel.MEDIUM: return 'bg-yellow-500/10 border-yellow-500/30';
      case RiskLevel.HIGH: return 'bg-orange-500/10 border-orange-500/30';
      case RiskLevel.CRITICAL: return 'bg-red-500/10 border-red-500/30';
      case RiskLevel.UNKNOWN: return 'bg-gray-800 border-gray-600';
      default: return 'bg-gray-800 border-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (isUnknown) return '#94a3b8'; // Gray for unknown
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#fbbf24'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Back Button */}
      <button 
        onClick={onReset}
        className="flex items-center text-gray-400 hover:text-white transition-colors mb-2 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Search
      </button>

      {/* Header Summary Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        {/* Background glow based on score */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: getScoreColor(result.safetyScore) }}
        ></div>

        {/* Score Circle or Error Icon */}
        <div className="relative shrink-0">
          {isUnknown ? (
            <div className="w-40 h-40 flex items-center justify-center bg-gray-800/50 rounded-full border-4 border-gray-700">
               <AlertCircle className="w-16 h-16 text-gray-500" />
            </div>
          ) : (
            <>
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  className="text-cyber-800"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
                <circle
                  className="transition-all duration-1000 ease-out"
                  strokeWidth="12"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * result.safetyScore) / 100}
                  strokeLinecap="round"
                  stroke={getScoreColor(result.safetyScore)}
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-4xl font-bold font-mono">{result.safetyScore}</span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">Safe</span>
              </div>
            </>
          )}
        </div>

        {/* Text Summary */}
        <div className="flex-1 space-y-4 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">
              {isUnknown ? 'Invalid Link' : 'Security Report'}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBg(result.overallRisk)} ${getRiskColor(result.overallRisk)}`}>
              {result.overallRisk}
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg">
            {result.summary}
          </p>
          {!isUnknown && (
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Lock size={14} /> Profile Analyzed</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full self-center"></span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Only show details if NOT unknown/invalid */}
      {!isUnknown && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Vulnerabilities Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400" />
              Detected Risks
            </h3>
            
            {result.vulnerabilities.length === 0 ? (
              <div className="glass-panel p-6 rounded-xl border-green-500/20 flex flex-col items-center text-center">
                  <ShieldCheck className="w-12 h-12 text-green-500 mb-2" />
                  <p className="text-green-200">No high-priority vulnerabilities detected in public footprint.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {result.vulnerabilities.map((vuln, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${getRiskBg(vuln.severity as RiskLevel)} transition-all hover:scale-[1.01]`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold ${getRiskColor(vuln.severity as RiskLevel)}`}>{vuln.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getRiskBg(vuln.severity as RiskLevel)} ${getRiskColor(vuln.severity as RiskLevel)}`}>
                        {vuln.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{vuln.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations & Good Findings Column */}
          <div className="space-y-6">
            
            {/* Action Items */}
            <div className="glass-panel p-6 rounded-2xl border-cyber-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="text-cyber-400" />
                Tailored Action Plan
              </h3>
              {result.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-300">
                      <ChevronRight className="w-5 h-5 text-cyber-500 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                 <p className="text-gray-400 text-sm">No specific actions required based on public data.</p>
              )}
            </div>

            {/* Positive Findings */}
            {result.positiveFindings.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl border-green-500/10">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="text-green-400" />
                  Good Practices
                </h3>
                <ul className="space-y-2">
                  {result.positiveFindings.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      )}
      
      {/* If unknown, show just a reset button context in the center */}
      {isUnknown && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-gray-400 mb-6 max-w-md">
                We couldn't analyze that link. Please make sure the URL is correct, the profile is public, and try again.
            </p>
            <button
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-3 bg-cyber-800 hover:bg-cyber-700 text-white rounded-lg transition-colors border border-cyber-600 font-medium"
            >
            <RefreshCw className="w-4 h-4" />
            Try Different Link
            </button>
        </div>
      )}

      {/* Standard Reset Button if NOT unknown (already shown in UI above, but let's hide the bottom one if Unknown to avoid duplicate) */}
      {!isUnknown && (
        <div className="flex justify-center pt-8 pb-12">
            <button
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-3 bg-cyber-800 hover:bg-cyber-700 text-white rounded-lg transition-colors border border-cyber-600 font-medium"
            >
            <RefreshCw className="w-4 h-4" />
            Scan Another Link
            </button>
        </div>
      )}
    </div>
  );
};

// Helper component for empty check if needed
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default Results;