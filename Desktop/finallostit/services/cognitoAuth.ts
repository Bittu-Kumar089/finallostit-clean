import { awsConfig } from './aws-exports';

/**
 * Direct Cognito Hosted UI authentication
 * This bypasses OIDC discovery and goes straight to Cognito
 */

export const getCognitoLoginUrl = (): string => {
  const redirectUri = encodeURIComponent(window.location.origin);
  const clientId = awsConfig.auth.userPoolWebClientId;
  const domain = awsConfig.auth.domain;
  const scopes = awsConfig.auth.scope.join('+');
  
  const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=code&scope=${scopes}&redirect_uri=${redirectUri}`;
  
  console.log('🔐 Cognito Login URL:', loginUrl);
  console.log('🔐 Redirect URI:', window.location.origin);
  
  return loginUrl;
};

export const getCognitoLogoutUrl = (): string => {
  const redirectUri = encodeURIComponent(window.location.origin);
  const clientId = awsConfig.auth.userPoolWebClientId;
  const domain = awsConfig.auth.domain;
  
  const logoutUrl = `https://${domain}/logout?client_id=${clientId}&logout_uri=${redirectUri}`;
  
  return logoutUrl;
};

/**
 * Extract authorization code from URL after Cognito redirect
 */
export const getAuthorizationCodeFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
};

/**
 * Exchange authorization code for tokens
 */
export const exchangeCodeForTokens = async (code: string): Promise<any> => {
  const redirectUri = window.location.origin;
  const clientId = awsConfig.auth.userPoolWebClientId;
  const domain = awsConfig.auth.domain;
  const tokenUrl = `https://${domain}/oauth2/token`;
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code: code,
    redirect_uri: redirectUri,
  });
  
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
};

/**
 * Get user info from Cognito
 */
export const getUserInfo = async (accessToken: string): Promise<any> => {
  const domain = awsConfig.auth.domain;
  const userInfoUrl = `https://${domain}/oauth2/userInfo`;
  
  try {
    const response = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Get user info failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};

