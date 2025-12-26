import React, { useEffect, useState } from 'react';
import { X, Shield, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from "react-oidc-context";
import { getCognitoLoginUrl, getCognitoLogoutUrl } from '../services/cognitoAuth';
import { awsConfig } from '../services/aws-exports';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (auth.error) {
      console.error("Auth Error:", auth.error);
      setError(auth.error.message || "Authentication error occurred");
    } else {
      setError(null);
    }
  }, [auth.error]);

  // Close modal automatically when user successfully signs in
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      console.log("✅ User authenticated, closing modal");
      // Small delay to show success state
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }, [auth.isAuthenticated, auth.user, onClose]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setError(null);
      setIsRedirecting(true);
      
      console.log("🔐 Attempting sign-in redirect...");
      console.log("Current origin:", window.location.origin);
      console.log("AWS Config:", {
        domain: awsConfig.auth.domain,
        clientId: awsConfig.auth.userPoolWebClientId,
        region: awsConfig.region,
      });
      
      // Try OIDC library first (it handles callback properly)
      try {
        console.log("🔄 Using OIDC library redirect");
        await auth.signinRedirect();
        // If successful, redirect will happen automatically
      } catch (oidcError: any) {
        console.warn("OIDC redirect failed, trying direct:", oidcError);
        // Fallback to direct redirect if OIDC fails
        const loginUrl = getCognitoLoginUrl();
        console.log("🔐 Generated login URL:", loginUrl);
        console.log("🔄 Redirecting now...");
        window.location.href = loginUrl;
      }
    } catch (err: any) {
      console.error("❌ Sign in error:", err);
      setIsRedirecting(false);
      setError(err.message || "Failed to redirect to sign-in page. Check browser console (F12) for details.");
    }
  };

  const handleSignOut = () => {
    try {
      auth.signoutRedirect().catch(() => {
        // Fallback to direct logout
        window.location.href = getCognitoLogoutUrl();
      });
    } catch {
      window.location.href = getCognitoLogoutUrl();
    }
  };

  const email = auth.user?.profile.email || auth.user?.profile.name;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="relative bg-white rounded-xl p-8 w-full max-w-sm z-10 text-center">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        <Shield className="mx-auto text-blue-600 mb-3" />
        <h2 className="text-xl font-bold mb-2">AWS Cognito</h2>
        <p className="text-sm text-gray-500 mb-6">
          Use your hosted Cognito sign-in to continue.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <strong>Error:</strong> {error}
              <div className="mt-2 text-xs text-red-600">
                <p><strong>Most likely cause:</strong> Callback URL not configured in Cognito</p>
                <p className="mt-1">See <strong>COGNITO_CHECKLIST.md</strong> for step-by-step fix</p>
              </div>
            </div>
          </div>
        )}

        {!auth.isAuthenticated ? (
          <button
            onClick={handleSignIn}
            disabled={isRedirecting}
            className={`w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors ${
              isRedirecting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isRedirecting ? 'Redirecting...' : 'Continue with Cognito'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              Signed in as <strong>{email}</strong>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full bg-white text-gray-900 border border-gray-300 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
