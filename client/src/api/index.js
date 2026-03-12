import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('finmate_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('finmate_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const registerUser  = (data)  => API.post('/auth/register', data);
export const loginUser     = (data)  => API.post('/auth/login', data);
export const getMe         = ()      => API.get('/auth/me');
export const updateProfile = (data)  => API.put('/auth/profile', data);

// ── Expenses ──
export const addExpense       = (data)   => API.post('/expenses', data);
export const getExpenses      = (params) => API.get('/expenses', { params });
export const getSummary       = (params) => API.get('/expenses/summary', { params });
export const getMonthlyTrends = ()       => API.get('/expenses/trends');
export const updateExpense    = (id, d)  => API.put(`/expenses/${id}`, d);
export const deleteExpense    = (id)     => API.delete(`/expenses/${id}`);

// ── Budgets ──
export const setBudget = (data)  => API.post('/budgets', data);
export const getBudget = (month) => API.get(`/budgets/${month}`);

// ── Groups ──
export const createGroup      = (data)            => API.post('/groups', data);
export const getGroups        = ()                => API.get('/groups');
export const getGroup         = (id)              => API.get(`/groups/${id}`);
export const addMember        = (gId, email)      => API.post(`/groups/${gId}/members`, { email });
export const addGroupExpense  = (gId, data)       => API.post(`/groups/${gId}/expenses`, data);
export const getGroupExpenses = (gId)             => API.get(`/groups/${gId}/expenses`);
export const getGroupBalances = (gId)             => API.get(`/groups/${gId}/balances`);
export const settleExpense    = (gId, data)       => API.post(`/groups/${gId}/settle`, data);

// ── Savings ──
export const createVault       = (data)      => API.post('/savings', data);
export const getVaults         = ()          => API.get('/savings');
export const depositToVault    = (id, data)  => API.post(`/savings/${id}/deposit`, data);
export const withdrawFromVault = (id, data)  => API.post(`/savings/${id}/withdraw`, data);
export const deleteVault       = (id)        => API.delete(`/savings/${id}`);
