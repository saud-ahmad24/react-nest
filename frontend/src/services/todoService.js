import axios from 'axios';
import { refreshToken } from './authService';

const API_URL = 'http://localhost:5000/todos';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.accessToken ? { Authorization: 'Bearer ' + user.accessToken } : {};
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return axios(originalRequest);
      } catch (err) {
        logout();
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

const logout = () => {
  localStorage.removeItem('user');
};

const fetchTodos = async () => {
  return await axios.get(API_URL, { headers: getAuthHeader() });
};

const createTodo = async (todo) => {
  return await axios.post(API_URL, todo, { headers: getAuthHeader() });
};

const updateTodo = async (id, todo) => {
  return await axios.put(`${API_URL}/${id}`, todo, { headers: getAuthHeader() });
};

const deleteTodo = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};

export { fetchTodos, createTodo, updateTodo, deleteTodo };
