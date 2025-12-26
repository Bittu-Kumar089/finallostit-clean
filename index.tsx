import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import App from './App';
import './index.css';
import { oidcConfig, onSigninCallback } from './services/authConfig';

// Add error handler for AuthProvider
const onSigninError = (error: Error) => {
  console.error("❌ Sign-in error:", error);
  console.error("Error details:", {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider 
      {...oidcConfig} 
      onSigninCallback={onSigninCallback}
      onSigninError={onSigninError}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);