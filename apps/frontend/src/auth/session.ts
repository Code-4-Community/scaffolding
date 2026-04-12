import { UserType } from '../api/types';

const userTypeSessionKey = 'bhchp.currentUserType';

const isBrowser = typeof window !== 'undefined';

/**
 * Persists the current user's role in session storage.
 *
 * @param userType The role to cache for the active browser tab.
 */
export const setCurrentSessionUserType = (userType: UserType | null): void => {
  if (!isBrowser) return;

  if (!userType) {
    sessionStorage.removeItem(userTypeSessionKey);
    return;
  }

  sessionStorage.setItem(userTypeSessionKey, userType);
};

/**
 * Removes any cached user role from session storage.
 */
export const clearCurrentSessionUserType = (): void => {
  if (!isBrowser) return;
  sessionStorage.removeItem(userTypeSessionKey);
};

/**
 * Reads and validates the cached user role from session storage.
 *
 * @returns A valid `UserType` value when present, otherwise `null`.
 */
export const getCurrentSessionUserTypeFromStorage = (): UserType | null => {
  if (!isBrowser) return null;

  const stored = sessionStorage.getItem(userTypeSessionKey);

  if (stored === UserType.ADMIN || stored === UserType.STANDARD) {
    return stored;
  }

  return null;
};
