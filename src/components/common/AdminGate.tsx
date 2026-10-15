import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useTranslation } from './TranslationProvider';
import {
  clearStoredAdminToken,
  getStoredAdminToken,
  storeAdminToken,
} from '../../utils/adminAuth';

export interface AdminAuthContextValue {
  token: string;
  logout: () => void;
  triggerAuthFailure: () => void;
}

export interface AdminGateProps {
  descriptionKey?: string;
  children: (auth: AdminAuthContextValue) => React.ReactNode;
}

export const AdminGate: React.FC<AdminGateProps> = ({
  descriptionKey = 'common.adminAuth.resumeDescription',
  children,
}) => {
  const { t } = useTranslation();
  const [adminToken, setAdminToken] = useState(getStoredAdminToken);
  const [tokenInput, setTokenInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAdminLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tokenInput.trim()) {
      setAuthError(t('common.adminAuth.tokenRequired', { fallback: 'Admin token is required.' }) as string);
      return;
    }
    setAuthError('');
    setAdminToken(storeAdminToken(tokenInput));
    setTokenInput('');
  };

  const handleAuthFailure = () => {
    clearStoredAdminToken();
    setAdminToken('');
    setAuthError(t('common.adminAuth.tokenInvalid', { fallback: 'Admin token is invalid or the server is not configured.' }) as string);
  };

  const handleAdminLogout = () => {
    clearStoredAdminToken();
    setAdminToken('');
  };

  if (!adminToken) {
    return (
      <div className="min-h-[70vh] bg-gray-50 dark:bg-gray-900 p-6 pt-24 flex items-center justify-center theme-transition">
        <form
          onSubmit={handleAdminLogin}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4 border border-gray-200 dark:border-gray-700 theme-transition"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 theme-transition" aria-hidden="true">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {t('common.adminAuth.title') as string}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                {t(descriptionKey) as string}
              </p>
            </div>
          </div>
          <input
            type="password"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('common.adminAuth.tokenPlaceholder', { fallback: 'ADMIN_TOKEN' }) as string}
            aria-label={t('common.adminAuth.tokenPlaceholder', { fallback: 'ADMIN_TOKEN' }) as string}
            autoComplete="current-password"
          />
          {authError && <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            {t('common.adminAuth.unlock') as string}
          </button>
        </form>
      </div>
    );
  }

  return <>{children({ token: adminToken, logout: handleAdminLogout, triggerAuthFailure: handleAuthFailure })}</>;
};

export default AdminGate;
