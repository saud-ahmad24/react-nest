import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
  if (response.data.accessToken) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const refreshToken = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post(`${API_URL}/refresh-token`, { token: user.refreshToken });
  if (response.data.accessToken) {
    user.accessToken = response.data.accessToken;
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data.accessToken;
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export { login, logout, refreshToken, getCurrentUser };
