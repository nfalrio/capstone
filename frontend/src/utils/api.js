const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }
    
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Mood methods
  async getMoods(userId) {
    return this.request(`/mood/${userId}`);
  }

  async createMood(moodData) {
    return this.request('/mood', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  async updateMood(moodId, moodData) {
    return this.request(`/mood/${moodId}`, {
      method: 'PUT',
      body: JSON.stringify(moodData),
    });
  }

  async deleteMood(moodId) {
    return this.request(`/mood/${moodId}`, {
      method: 'DELETE',
    });
  }

  async getMoodStats(userId, period = 30) {
    return this.request(`/mood/${userId}/stats?period=${period}`);
  }

  // Journal methods
  async getJournals(userId) {
    return this.request(`/journal/${userId}`);
  }

  async createJournal(journalData) {
    return this.request('/journal', {
      method: 'POST',
      body: JSON.stringify(journalData),
    });
  }

  async updateJournal(journalId, journalData) {
    return this.request(`/journal/${journalId}`, {
      method: 'PUT',
      body: JSON.stringify(journalData),
    });
  }

  async deleteJournal(journalId) {
    return this.request(`/journal/${journalId}`, {
      method: 'DELETE',
    });
  }

  async analyzeJournal(journalId) {
    return this.request(`/journal/${journalId}/analyze`, {
      method: 'POST',
    });
  }

  // ML methods
  async predictSentiment(text) {
    return this.request('/ml/predict', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async checkMLHealth() {
    return this.request('/ml/health');
  }

  // User methods
  async getUser (userId) {
    return this.request(`/user/${userId}`);
  }

  async updateUser (userId, userData) {
    return this.request(`/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

export default new ApiService();
