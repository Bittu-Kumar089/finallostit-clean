import { UserManagerSettings } from "oidc-client-ts";
import { awsConfig } from "./aws-exports";

const redirectUri = window.location.origin;

// Log configuration for debugging
console.log("🔐 Cognito Configuration:", {
  region: awsConfig.region,
  userPoolId: awsConfig.auth.userPoolId,
  clientId: awsConfig.auth.userPoolWebClientId,
  domain: awsConfig.auth.domain,
  redirectUri: redirectUri,
});

// Use Cognito IDP endpoint for OIDC discovery (not the hosted UI domain)
const authority = `https://cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.auth.userPoolId}`;
const wellKnown = `${authority}/.well-known/openid-configuration`;

export const oidcConfig: UserManagerSettings = {
  authority,
  client_id: awsConfig.auth.userPoolWebClientId,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,
  response_type: "code",
  scope: awsConfig.auth.scope.join(" "),
  automaticSilentRenew: false, // Disable to avoid issues
  monitorSession: false, // Disable to avoid issues
  loadUserInfo: true,
  metadataUrl: wellKnown,
  // Additional settings for better error handling
  silent_redirect_uri: redirectUri,
  revokeAccessTokenOnSignout: true,
  // Disable automatic redirect on errors
  redirectMethod: "replace",
};

export const onSigninCallback = () => {
  // Clear query params after the hosted UI redirect so routing stays clean
  window.history.replaceState({}, document.title, window.location.pathname);
};

