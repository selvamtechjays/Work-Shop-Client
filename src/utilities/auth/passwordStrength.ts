/**
 * Calculate password strength score based on multiple criteria
 * @param password - The password string to evaluate
 * @returns Score from 0-6
 */
export function calculatePasswordStrength(password: string): number {
  let score = 0;

  // Length criteria
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character type criteria
  if (/[A-Z]/.test(password)) score += 1; // Uppercase letter
  if (/[a-z]/.test(password)) score += 1; // Lowercase letter
  if (/[0-9]/.test(password)) score += 1; // Number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special character

  return score;
}

/**
 * Get strength label based on score
 * @param score - Password strength score (0-6)
 * @returns Strength label: 'weak', 'medium', or 'strong'
 */
export function getStrengthLabel(score: number): 'weak' | 'medium' | 'strong' {
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

/**
 * Get color code for strength level
 * @param strength - Strength label
 * @returns Hex color code
 */
export function getStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
  const colors = {
    weak: '#ef4444',    // red
    medium: '#f59e0b',  // yellow
    strong: '#10b981',  // green
  };
  return colors[strength];
}
