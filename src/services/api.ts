import type { SpeechFeedback, UserStats, WordOfDay } from '../types';

const API_BASE = 'http://localhost:4000/api';

export const backendAPI = {
  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Save session to backend
  async saveSession(session: SpeechFeedback): Promise<SpeechFeedback> {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
      if (!res.ok) throw new Error('Failed to save session');
      const data = await res.json();
      return data.session || session;
    } catch (err) {
      console.warn('Backend save offline fallback:', err);
      return session;
    }
  },

  // Fetch all sessions from backend
  async getSessions(): Promise<SpeechFeedback[]> {
    try {
      const res = await fetch(`${API_BASE}/sessions`);
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      return data.sessions || [];
    } catch (err) {
      console.warn('Backend fetch offline fallback:', err);
      return [];
    }
  },

  // Delete a session from backend
  async deleteSession(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/sessions/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Clear all history on backend
  async clearAllSessions(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/sessions`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async clearHistory(): Promise<boolean> {
    return this.clearAllSessions();
  },

  // Fetch today's 10 dynamic words from backend
  async getDailyWords(dateStr?: string): Promise<WordOfDay[]> {
    try {
      const url = dateStr ? `${API_BASE}/vocabulary/today?date=${dateStr}` : `${API_BASE}/vocabulary/today`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch daily words');
      const data = await res.json();
      return data.words || [];
    } catch (err) {
      console.warn('Backend daily words fallback:', err);
      return [];
    }
  },

  // Fetch overall backend user stats
  async getUserStats(): Promise<Partial<UserStats> | null> {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
