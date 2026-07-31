import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearStoredAdminToken,
  getAdminAuthHeaders,
  getStoredAdminToken,
  storeAdminToken,
} from '../utils/adminAuth';

describe('adminAuth', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('stores only the trimmed token in session storage', () => {
    expect(storeAdminToken('  admin-secret  ')).toBe('admin-secret');
    expect(getStoredAdminToken()).toBe('admin-secret');
    expect(window.localStorage.getItem('admin_token')).toBeNull();
  });

  it('returns an empty token when no session token exists', () => {
    expect(getStoredAdminToken()).toBe('');
  });

  it('clears the current session token', () => {
    storeAdminToken('admin-secret');

    clearStoredAdminToken();

    expect(getStoredAdminToken()).toBe('');
  });

  it('creates a bearer authorization header', () => {
    expect(getAdminAuthHeaders('admin-secret')).toEqual({
      Authorization: 'Bearer admin-secret',
    });
  });
});
