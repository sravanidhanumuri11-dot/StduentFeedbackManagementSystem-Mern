const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('feedbackhub_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Not valid JSON
    }
  }

  if (!res.ok) {
    const errorMsg = (data && data.message) || 
      (res.status === 502 || res.status === 504 
        ? 'Cannot connect to backend server. Please verify the backend is running on port 5050.' 
        : `Request failed with status ${res.status}`);
    throw new Error(errorMsg);
  }
  return data || {};
};

export const api = {
  auth: {
    login: async (identifier, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      return handleResponse(res);
    },
    adminLogin: async (username, password) => {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  feedback: {
    create: async (feedbackData) => {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(feedbackData)
      });
      return handleResponse(res);
    },
    getMy: async () => {
      const res = await fetch(`${API_BASE}/feedback/my`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/feedback/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  admin: {
    getStats: async () => {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getAllFeedbacks: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/admin/feedbacks?${query}`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    deleteFeedback: async (id) => {
      const res = await fetch(`${API_BASE}/admin/feedbacks/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getStudents: async () => {
      const res = await fetch(`${API_BASE}/admin/students`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    exportFeedbacks: async () => {
      const res = await fetch(`${API_BASE}/admin/export`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  courses: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/courses`);
      return handleResponse(res);
    }
  }
};
