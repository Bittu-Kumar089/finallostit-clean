import React from 'react';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis 
} from 'recharts';
import { 
  AlertOctagon, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  FileText,
  Search,
  Cpu
} from 'lucide-react';
import { AnalysisResult, FileMetadata, ThreatLevel } from '../types';
import { THREAT_COLORS, THREAT_BG_COLORS } from '../constants';
import { formatBytes } from '../utils/fileHelpers';

interface AnalysisReportProps {
  result: AnalysisResult;
  fileMetadata: FileMetadata;
  reset: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, fileMetadata, reset }) => {
  const chartData = [
    {
      name: 'Risk Score',
      value: result.score,
      fill: result.threatLevel === ThreatLevel.SAFE ? '#10b981' : 
            result.threatLevel === ThreatLevel.SUSPICIOUS ? '#fbbf24' : '#f43f5e'
    }
  ];

  const StatusIcon = () => {
    switch (result.threatLevel) {
      case ThreatLevel.SAFE: return <CheckCircle2 className="h-12 w-12 text-emerald-400" />;
      case ThreatLevel.SUSPICIOUS: return <AlertTriangle className="h-12 w-12 text-amber-400" />;
      case ThreatLevel.DANGEROUS: return <AlertOctagon className="h-12 w-12 text-rose-500" />;
      default: return <Search className="h-12 w-12 text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Card */}
      <div className={`relative overflow-hidden rounded-2xl border p-8 ${THREAT_BG_COLORS[result.threatLevel]}`}>
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              <StatusIcon />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold tracking-wider px-2 py-0.5 rounded text-slate-900 ${
                   result.threatLevel === ThreatLevel.SAFE ? 'bg-emerald-400' :
                   result.threatLevel === ThreatLevel.SUSPICIOUS ? 'bg-amber-400' : 'bg-rose-500 text-white'
                }`}>
                  {result.threatLevel}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete</h2>
              <p className="text-slate-300 max-w-lg">{result.summary}</p>
            </div>
          </div>

          {/* Gauge Chart */}
          <div className="w-48 h-48 relative">
             <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="70%" 
                outerRadius="100%" 
                barSize={10} 
                data={chartData} 
                startAngle={180} 
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={30} // Deprecated prop type fix in newer recharts, but often still works or use standard CSS
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-4xl font-bold text-white">{result.score}</span>
              <span className="text-xs text-slate-400 uppercase tracking-widest">Risk Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* File Details */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-slate-200">File Metadata</h3>
          </div>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Name</span>
              <span className="text-slate-300 truncate max-w-[200px]">{fileMetadata.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Size</span>
              <span className="text-slate-300">{formatBytes(fileMetadata.size)}</span>
            </div>
             <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Extension</span>
              <span className="text-slate-300">.{fileMetadata.extension}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">MIME</span>
              <span className="text-slate-300">{fileMetadata.type}</span>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-slate-200">Technical Findings</h3>
          </div>
          <ul className="space-y-3">
            {result.technicalDetails.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Magic Bytes Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
         <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-slate-200">Header Hex Dump (Magic Bytes)</h3>
          </div>
          <div className="bg-black/50 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 overflow-x-auto">
            {fileMetadata.magicBytes}
          </div>
      </div>

       {/* Recommendation */}
       <div className="bg-slate-800/40 border-l-4 border-indigo-500 rounded-r-xl p-6">
          <h4 className="text-indigo-400 font-semibold mb-2 uppercase text-xs tracking-wider">Recommendation</h4>
          <p className="text-slate-200">{result.recommendation}</p>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={reset}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600 font-medium"
        >
          Analyze Another File
        </button>
      </div>
    </div>
  );
};

export default AnalysisReport;