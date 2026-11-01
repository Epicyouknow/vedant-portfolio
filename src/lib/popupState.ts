'use client';

export interface PopupState {
  stage: number; // 0 = initial (pre-1), 1 = first popup, 2 = second popup, 3 = third popup, 4 = completed
  firstVisitTime: number;
  lastDismissedTime: number | null;
  nextTriggerTime: number | null;
  isSubmitted: boolean;
  submittedAt: number | null;
  cooldownUntil: number | null;
  dismissCount: number;
}

const STORAGE_KEY = 'vedantverse_lead_popup_state';
const STAGE_1_DELAY = 5 * 1000; // 5 seconds
const STAGE_2_DELAY = 27 * 1000; // 27 seconds
const STAGE_3_DELAY = 5 * 60 * 1000; // 5 minutes
const COOLDOWN_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getPopupState(): PopupState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading popup state from localStorage:', err);
    return null;
  }
}

export function savePopupState(state: PopupState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving popup state to localStorage:', err);
  }
}

export function initPopupState(): PopupState {
  const existing = getPopupState();
  if (existing) {
    // If cooldown has expired, reset sequence
    if (existing.cooldownUntil && Date.now() >= existing.cooldownUntil && !existing.isSubmitted) {
      const refreshed: PopupState = {
        stage: 1,
        firstVisitTime: Date.now(),
        lastDismissedTime: null,
        nextTriggerTime: Date.now() + STAGE_1_DELAY,
        isSubmitted: false,
        submittedAt: null,
        cooldownUntil: null,
        dismissCount: 0,
      };
      savePopupState(refreshed);
      return refreshed;
    }
    return existing;
  }

  // First time visitor
  const initial: PopupState = {
    stage: 1,
    firstVisitTime: Date.now(),
    lastDismissedTime: null,
    nextTriggerTime: Date.now() + STAGE_1_DELAY,
    isSubmitted: false,
    submittedAt: null,
    cooldownUntil: null,
    dismissCount: 0,
  };
  savePopupState(initial);
  return initial;
}

export function recordPopupDismissal(currentStage: number): PopupState {
  const state = getPopupState() || initPopupState();
  const now = Date.now();

  let nextStage = currentStage + 1;
  let nextTriggerTime: number | null = null;
  let cooldownUntil = state.cooldownUntil;

  if (currentStage === 1) {
    nextStage = 2;
    nextTriggerTime = now + STAGE_2_DELAY;
  } else if (currentStage === 2) {
    nextStage = 3;
    nextTriggerTime = now + STAGE_3_DELAY;
  } else {
    // Stage 3 dismissed -> sequence complete, 7-day cooldown
    nextStage = 4;
    nextTriggerTime = null;
    cooldownUntil = now + COOLDOWN_PERIOD;
  }

  const updated: PopupState = {
    ...state,
    stage: nextStage,
    lastDismissedTime: now,
    nextTriggerTime,
    cooldownUntil,
    dismissCount: state.dismissCount + 1,
  };

  savePopupState(updated);
  return updated;
}

export function recordPopupSubmission(): PopupState {
  const state = getPopupState() || initPopupState();
  const now = Date.now();

  const updated: PopupState = {
    ...state,
    isSubmitted: true,
    submittedAt: now,
    nextTriggerTime: null,
    stage: 4, // Permanently stop
  };

  savePopupState(updated);
  return updated;
}

export function checkPopupEligibility(pathname: string): { eligible: boolean; stage: number; msRemaining: number } {
  // Suppress on admin, auth, privacy, support routes
  const excludedPrefixes = ['/admin', '/privacy', '/support', '/login'];
  if (excludedPrefixes.some((p) => pathname.startsWith(p))) {
    return { eligible: false, stage: 0, msRemaining: -1 };
  }

  const state = initPopupState();

  // If already submitted, permanently stop
  if (state.isSubmitted) {
    return { eligible: false, stage: 0, msRemaining: -1 };
  }

  // If currently in 7-day cooldown
  if (state.cooldownUntil && Date.now() < state.cooldownUntil) {
    return { eligible: false, stage: 0, msRemaining: state.cooldownUntil - Date.now() };
  }

  // Sequence completed without cooldown active
  if (state.stage > 3) {
    return { eligible: false, stage: 0, msRemaining: -1 };
  }

  if (!state.nextTriggerTime) {
    return { eligible: false, stage: 0, msRemaining: -1 };
  }

  const msRemaining = state.nextTriggerTime - Date.now();
  if (msRemaining <= 0) {
    return { eligible: true, stage: state.stage, msRemaining: 0 };
  }

  return { eligible: false, stage: state.stage, msRemaining };
}
