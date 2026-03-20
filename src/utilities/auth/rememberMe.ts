const REMEMBER_ME_KEY = 'rememberMe';

/**
 * Store remember me preference to localStorage
 * @param remember - Boolean indicating if user wants to be remembered
 */
export function setRememberMePreference(remember: boolean): void {
  localStorage.setItem(REMEMBER_ME_KEY, remember.toString());
}

/**
 * Get remember me preference from localStorage
 * @returns Boolean indicating if user wants to be remembered (defaults to false)
 */
export function getRememberMePreference(): boolean {
  const value = localStorage.getItem(REMEMBER_ME_KEY);
  return value === 'true';
}

/**
 * Alias for getRememberMePreference
 * @returns Boolean indicating if session should be remembered
 */
export function shouldRememberSession(): boolean {
  return getRememberMePreference();
}

/**
 * Clear remember me preference
 */
export function clearRememberMePreference(): void {
  localStorage.removeItem(REMEMBER_ME_KEY);
}
