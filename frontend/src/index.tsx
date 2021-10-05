import React from 'react';
import { render } from 'react-dom';
import App from 'components/App';
import * as serviceWorker from 'serviceWorker';
import configureStore from 'configureStore';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'index.scss';
import { HotModule } from 'interfaces';
import { io } from 'socket.io-client';

export const store = configureStore({
  user: {
    token: localStorage.getItem('token'),
    userID: null,
    email: null,
    nick: null,
    avatar: null,
    date: null,
    isLogged: null,
    loading: true
  },
  onlineUsers: []
});

export const socket = io(process.env.NODE_ENV === 'production' ?
  'https://read-and-write-app.herokuapp.com' : 'http://localhost:8050');

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV !== 'production' && (module as HotModule).hot) {
  (module as HotModule).hot.accept('./components/App', renderApp)
}

renderApp();


serviceWorker.register('');
