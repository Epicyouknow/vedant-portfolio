export interface RateLimitData {
  stage: 1 | 2 | 3 | 4 | 5 | 6; // 1: 5 att, 2: 4 att, 3: 3 att, 4: 2 att, 5: 1 att, 6: BLOCKED
  attemptsRemaining: number;
  maxAttempts: number;
  isLocked: boolean;
  lockoutExpiry: number | null;
  isBlocked: boolean;
  lastAttemptAt?: number;
}

export const RATE_LIMIT_TIERS: Record<number, { maxAttempts: number; label: string; lockoutHours: number }> = {
  1: { maxAttempts: 5, label: "Chance 1 (Initial)", lockoutHours: 6 },
  2: { maxAttempts: 4, label: "Chance 2 (After 6 hrs)", lockoutHours: 6 },
  3: { maxAttempts: 3, label: "Chance 3 (After 12 hrs)", lockoutHours: 6 },
  4: { maxAttempts: 2, label: "Chance 4 (After 18 hrs)", lockoutHours: 6 },
  5: { maxAttempts: 1, label: "Chance 5 (Final Chance)", lockoutHours: 6 },
  6: { maxAttempts: 0, label: "Permanently Blocked", lockoutHours: 0 },
};

export interface MonitoredAccount {
  email: string;
  name: string;
  rateLimit: RateLimitData;
}
