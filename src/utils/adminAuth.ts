const ADMIN_TOKEN_STORAGE_KEY = 'admin_token';

export function getStoredAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
}

export function storeAdminToken(token: string): string {
  const cleanToken = token.trim();
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, cleanToken);
  }
  return cleanToken;
}

export function clearStoredAdminToken(): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  }
}

export function getAdminAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}
