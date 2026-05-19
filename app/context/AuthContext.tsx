'use client';

import {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from 'react';

/* ── Types ─────────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;       // two-letter initials
  role: 'citizen' | 'admin';
  civicScore: number;
  badge: string;
  joinedDate: string;
  phone: string;
  location: string;
  stats: {
    reported: number;
    resolved: number;
    votes: number;
    comments: number;
  };
}

interface StoredUser extends User {
  password: string;     // plain-text for demo — never do this in production
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn:  (email: string, password: string) => Promise<AuthResult>;
  signUp:  (name: string, email: string, password: string, phone?: string, location?: string) => Promise<AuthResult>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
}

/* ── Storage keys ───────────────────────────────────────── */
const USERS_KEY   = 'jansankalp_users';
const SESSION_KEY = 'jansankalp_session';

/* ── Pre-seeded accounts ────────────────────────────────── */
const SEED_USERS: StoredUser[] = [
  {
    id: 'user_vivek',
    name: 'Vivek Pant',
    email: 'vivek9to5@gmail.com',
    password: 'vivek123',
    avatar: 'VP',
    role: 'admin',
    civicScore: 312,
    badge: '🏆 Civic Champion',
    joinedDate: 'March 2023',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    stats: { reported: 28, resolved: 21, votes: 87, comments: 43 },
  },
  {
    id: 'user_bhumika',
    name: 'Bhumika Pant',
    email: 'bhumika.pant0701@gmail.com',
    password: 'bhumika123',
    avatar: 'BH',
    role: 'citizen',
    civicScore: 245,
    badge: '⭐ Star Reporter',
    joinedDate: 'January 2024',
    phone: '+91 93000 00000',
    location: 'New Delhi, India',
    stats: { reported: 12, resolved: 8, votes: 34, comments: 19 },
  },
];

/* ── Helpers ────────────────────────────────────────────── */
function makeInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getMonthYear(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed: StoredUser[] = JSON.parse(raw);
    // Merge — keep seed users up-to-date, append any registered users
    const seedIds = new Set(SEED_USERS.map((u) => u.id));
    const extra = parsed.filter((u) => !seedIds.has(u.id));
    return [...SEED_USERS, ...extra];
  } catch {
    return SEED_USERS;
  }
}

function saveStoredUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function stripPassword(u: StoredUser): User {
  const { password: _, ...rest } = u;
  return rest;
}

/* ── Context ────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const users = getStoredUsers();
        const found = users.find((u) => u.id === sessionId);
        if (found) setUser(stripPassword(found));
      }
    } catch {/* ignore */}
    setIsLoading(false);
  }, []);

  /* Sign In */
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: 'No account found with this email.' };

    // For seeded accounts any password works (demo); for registered ones check exact match
    const isSeed = SEED_USERS.some((s) => s.id === found.id);
    if (!isSeed && found.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }

    const loggedIn = stripPassword(found);
    setUser(loggedIn);
    localStorage.setItem(SESSION_KEY, found.id);
    return { success: true };
  }, []);

  /* Sign Up */
  const signUp = useCallback(async (
    name: string, email: string, password: string,
    phone = '', location = 'India',
  ): Promise<AuthResult> => {
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: StoredUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: makeInitials(name),
      role: 'citizen',
      civicScore: 0,
      badge: '🌱 New Member',
      joinedDate: getMonthYear(),
      phone: phone || '',
      location: location || 'India',
      stats: { reported: 0, resolved: 0, votes: 0, comments: 0 },
    };

    const updated = [...users, newUser];
    saveStoredUsers(updated);
    const loggedIn = stripPassword(newUser);
    setUser(loggedIn);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return { success: true };
  }, []);

  /* Sign Out */
  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  /* Update profile fields */
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Persist to stored users
      const users = getStoredUsers();
      const next = users.map((u) =>
        u.id === updated.id ? { ...u, ...updates } : u,
      );
      saveStoredUsers(next);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
