
import { Item } from '../types';

/**
 * YOUR ACTIVE LAMBDA URL
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  "https://iguiyy45byjnuybh5t24uirpji0fzpzd.lambda-url.us-east-1.on.aws/";

type TokenProvider = () => Promise<string | null> | string | null;
let authTokenProvider: TokenProvider | null = null;

export const setAuthTokenProvider = (provider: TokenProvider) => {
  authTokenProvider = provider;
};

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  if (!authTokenProvider) return {};
  const token = typeof authTokenProvider === "function" ? await authTokenProvider() : authTokenProvider;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBaseUrl = () => {
  if (!API_BASE_URL || API_BASE_URL.includes("PASTE_YOUR")) return "";
  const url = API_BASE_URL.trim();
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * Detailed Health Check
 */
export const checkBackendHealth = async (): Promise<{ status: boolean; reason?: string }> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return { status: false, reason: "URL_NOT_CONFIGURED" };

  try {
    const response = await fetch(
      `${baseUrl}/items`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store'
      }
    );

    if (response.ok) return { status: true };
    return { status: false, reason: `HTTP_${response.status}` };
  } catch (err: any) {
    console.error("Connection Diagnostic:", err);
    return { status: false, reason: "CORS_OR_NETWORK_ERROR" };
  }
};

export const getItems = async (): Promise<Item[]> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) throw new Error("Backend URL not configured.");

  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/items`, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Accept': 'application/json', ...authHeaders }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server Error (${response.status}): ${text || 'Unknown issue'}`);
    }

    return await response.json();
  } catch (err: any) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error("CORS ERROR: Your Lambda 'Auth Type' must be NONE and 'CORS' must be enabled in AWS Console.");
    }
    throw err;
  }
};

export const createItem = async (item: Item): Promise<Item> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return item;

  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${baseUrl}/items`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify(item)
  });

  if (!response.ok) throw new Error(`Save failed: ${response.status}`);
  return await response.json();
};

export const deleteItem = async (id: string): Promise<void> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return;
  const authHeaders = await getAuthHeaders();
  await fetch(`${baseUrl}/items/${id}`, { method: 'DELETE', mode: 'cors', headers: authHeaders });
};

export const claimItem = async (itemId: string): Promise<void> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return;
  const authHeaders = await getAuthHeaders();
  await fetch(`${baseUrl}/items/${itemId}/claim`, { method: 'POST', mode: 'cors', headers: authHeaders });
};

export const uploadImageToS3 = async (file: File): Promise<string> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return URL.createObjectURL(file);

  try {
    const fileName = `uploads/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/upload-url`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ fileName, fileType: file.type })
    });

    if (!response.ok) throw new Error('Handshake failed');
    const { uploadUrl, viewUrl } = await response.json();

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });

    return viewUrl;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return URL.createObjectURL(file);
  }
};
