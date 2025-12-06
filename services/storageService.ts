
import { UserProfile, InvoiceHistoryItem } from '../types';

const STORAGE_KEYS = {
  USER: 'invoicesnap_user_v3_beta',
  HISTORY: 'invoicesnap_history_v3_beta'
};

const DEFAULT_USER: UserProfile = {
  id: 'guest_' + Math.random().toString(36).substr(2, 9),
  isLoggedIn: false,
  creditsUsed: 0,
  maxCredits: 15,
  bulkEventsUsed: 0,
  isPro: false,
  plan: 'FREE',
  joinedAt: new Date().toISOString()
};

// --- User Management ---

export const getUser = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (!stored) return DEFAULT_USER;
    
    const parsed = JSON.parse(stored);
    // Migration for new field
    if (parsed.bulkEventsUsed === undefined) parsed.bulkEventsUsed = 0;
    
    return parsed;
  } catch (e) {
    console.error("Storage Error", e);
    return DEFAULT_USER;
  }
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  window.dispatchEvent(new Event('storage-update'));
};

export const incrementUsage = (count: number = 1): boolean => {
  const user = getUser();
  
  if (!user.isPro && user.creditsUsed + count > user.maxCredits) {
    return false; // Monthly Limit Reached
  }
  
  user.creditsUsed += count;
  saveUser(user);
  return true;
};

export const incrementBulkUsage = (): boolean => {
    const user = getUser();
    // Free limit: 3 bulk upload events
    if (!user.isPro && user.bulkEventsUsed >= 3) {
        return false;
    }
    user.bulkEventsUsed += 1;
    saveUser(user);
    return true;
};

export const upgradeUser = (plan: 'PRO_MONTHLY' | 'LIFETIME' | 'PAYG') => {
  const user = getUser();
  user.isPro = true;
  user.plan = plan;
  user.maxCredits = 999999; // Effectively infinite
  saveUser(user);
};

export const loginUser = (email: string) => {
  const user = getUser();
  user.isLoggedIn = true;
  user.email = email;
  saveUser(user);
};

export const logoutUser = () => {
    const user = getUser();
    user.isLoggedIn = false;
    saveUser(user);
}

// --- History Management ---

export const getHistory = (): InvoiceHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const addToHistory = (item: InvoiceHistoryItem) => {
  const history = getHistory();
  const newHistory = [item, ...history];
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
  window.dispatchEvent(new Event('history-update'));
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    window.dispatchEvent(new Event('history-update'));
}
