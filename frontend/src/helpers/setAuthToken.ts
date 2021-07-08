import api from './api';

const setAuthToken = ({ token, userID }: { token: string; userID: string }) => {
  if (token) {
    api.defaults.headers.common['auth-token'] = token;
    localStorage.setItem('token', token);
    localStorage.setItem('userID', userID);

  } else {
    delete api.defaults.headers.common['auth-token'];
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
  }
};

export default setAuthToken;