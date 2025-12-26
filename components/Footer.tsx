
import React, { useEffect, useState } from 'react';
import { Cloud, ShieldCheck, Activity, CheckCircle2, Loader2, WifiOff, Link, Wrench, Github, Linkedin, Mail, Phone, AlertTriangle, ExternalLink } from 'lucide-react';
import { checkBackendHealth, API_BASE_URL } from '../services/api';

const Footer: React.FC = () => {
  const [status, setStatus] = useState<'LOADING' | 'CONNECTED' | 'OFFLINE' | 'MOCK'>('LOADING');
  const [errorReason, setErrorReason] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (!API_BASE_URL || API_BASE_URL.includes("PASTE_YOUR")) {
        setStatus('MOCK');
        return;
      }

      const health = await checkBackendHealth();
      if (health.status) {
        setStatus('CONNECTED');
        setErrorReason(null);
      } else {
        setStatus('OFFLINE');
        setErrorReason(health.reason || "Unknown Error");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const handleDiagnose = () => {
    let fix = "";
    if (errorReason === "CORS_OR_NETWORK_ERROR") {
      fix = "1. Open Lambda Console\n2. Go to Configuration -> Function URL\n3. Set Auth Type to NONE\n4. Check 'Configure CORS' and set 'Allow Origin' to '*'";
    } else if (errorReason?.startsWith("HTTP_403")) {
      fix = "Access Denied. Ensure your IAM role has 'AmazonDynamoDBFullAccess' policy attached.";
    } else if (errorReason?.startsWith("HTTP_500")) {
      fix = "Server Error. Check your Lambda logs in CloudWatch. Ensure table name 'lostit-backend' is correct in Python.";
    }

    alert(`🔍 CONNECTION DIAGNOSTICS\n\nTarget URL: ${API_BASE_URL}\nError: ${errorReason}\n\nREQUIRED FIX:\n${fix || "Ensure the table 'lostit-backend' exists in DynamoDB and your IAM role has permissions."}`);
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900">LOST<span className="text-blue-600">it</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              The intelligent, serverless lost & found platform. Built with AWS & Gemini.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Stack</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold text-gray-600"><Cloud className="h-4 w-4 text-blue-500" /> AWS Lambda</li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-600"><ShieldCheck className="h-4 w-4 text-indigo-500" /> Amazon S3</li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-600"><Activity className="h-4 w-4 text-violet-500" /> DynamoDB</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Environment</h4>
            <div
              onClick={handleDiagnose}
              className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border shadow-sm transition-all cursor-pointer hover:shadow-md ${status === 'CONNECTED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                  status === 'OFFLINE' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                    'bg-gray-50 border-gray-200 text-gray-500'
                }`}
            >
              <div className={`h-2 w-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' :
                  status === 'OFFLINE' ? 'bg-rose-500' : 'bg-gray-400'
                }`}></div>
              <span className="text-[11px] font-black uppercase tracking-widest">
                {status === 'CONNECTED' ? 'Cloud Live' : status === 'OFFLINE' ? 'CORS Blocked' : 'Check Config'}
              </span>
              {status === 'OFFLINE' && <AlertTriangle className="w-3 h-3 ml-1" />}
            </div>
            {status === 'OFFLINE' && (
              <p className="mt-3 text-[10px] text-rose-400 font-bold uppercase tracking-wider animate-pulse">
                Click badge to fix connection
              </p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Resources</h4>
            <a
              href="https://console.aws.amazon.com/lambda/home#/functions"
              target="_blank"
              className="text-xs font-bold text-blue-600 flex items-center gap-2 hover:underline"
            >
              AWS Console <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">© 2024 LOSTit Project</p>
          <p className="text-[10px] text-gray-300 font-medium">Lambda Endpoint: {API_BASE_URL.slice(0, 30)}...</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
