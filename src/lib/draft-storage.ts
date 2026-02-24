/**
 * Auto-save draft for Reading Test Builder: localStorage key, TTL 24h, read/write helpers.
 */

export const DRAFT_STORAGE_KEY = 'ielts-reading-test-builder-draft';
export const DRAFT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const DRAFT_AUTO_SAVE_INTERVAL_MS = 30 * 1000; // 30 seconds

export interface DraftPayload {
  info: {
    title: string;
    instructions: string;
    totalDuration: string;
  };
  sections: unknown[];
}

export interface DraftStored {
  payload: DraftPayload;
  savedAt: number;
  expiresAt: number;
}

export function saveDraft(payload: DraftPayload): void {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  const data: DraftStored = {
    payload,
    savedAt: now,
    expiresAt: now + DRAFT_TTL_MS,
  };
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota or disabled
  }
}

export function loadDraft(): DraftPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as DraftStored;
    if (data.expiresAt <= Date.now()) {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }
    return data.payload ?? null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

