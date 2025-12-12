const API_BASE = import.meta.env.DEV ? '/api' : '/api';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('plato_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (token) {
      headers['X-Plato-Token'] = token;
    }

    const response = await fetch(API_BASE + endpoint, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export default api;