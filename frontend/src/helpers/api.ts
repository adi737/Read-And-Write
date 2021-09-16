import axios from 'axios';
import { store } from 'index';
import { LOGOUT_USER } from 'reducers/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response.data.msg === 'Authentication denied, invalid token' ||
      err.response.data.msg === 'Authentication denied, no token') {
      store.dispatch({ type: LOGOUT_USER });
    }
    return Promise.reject(err);
  }
);

export default api;