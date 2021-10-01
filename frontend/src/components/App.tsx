import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'components/layouts/Content';
import Navigation from 'components/layouts/Navigation';
import Loader from 'helpers/Loader';
import { State } from 'interfaces';
import { QueryClientProvider, QueryClient } from 'react-query';
import setAuthToken from 'helpers/setAuthToken';
import { LOGIN_USER, SET_USERS } from '../reducers/types';
import api from 'helpers/api';
import { socket } from '../index';
// import { ReactQueryDevtools } from 'react-query/devtools'


function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state: State) => state.user.loading);
  const userId = useSelector((state: State) => state.user.userID);
  const email = useSelector((state: State) => state.user.email);
  const nick = useSelector((state: State) => state.user.nick);
  const avatar = useSelector((state: State) => state.user.avatar);
  const date = useSelector((state: State) => state.user.date);
  const isLogged = useSelector((state: State) => state.user.isLogged)

  const checkIfLogged = useCallback(() => {
    setAuthToken({
      token: localStorage.getItem('token')!,
    });

    const getUser = async () => {
      try {
        const { data: user } = await api.get('/user');
        dispatch({
          type: LOGIN_USER,
          token: localStorage.getItem('token'),
          userID: user._id,
          email: user.email,
          nick: user.nick,
          avatar: user.avatar,
          date: user.date
        });
      } catch (error: any) {
        console.error(error.response.data)
      }
    }

    getUser();
  }, [dispatch]);

  useEffect(() => {
    checkIfLogged()
  }, [checkIfLogged])

  const queryClient = new QueryClient()

  useEffect(() => {
    if (isLogged) {
      socket.emit('addUser', { userId, email, nick, avatar, date });
    }
  }, [isLogged, userId, email, nick, avatar, date]);

  useEffect(() => {
    socket.on('getUsers', (users) => {
      const onlineUsers = users.filter((user, index, array) =>
        index === array.findIndex(element => element.userId === user.userId)
      );

      dispatch({
        type: SET_USERS,
        payload: onlineUsers
      });

    });
  }, [dispatch]);

  return loading ?
    <Loader />
    :
    <QueryClientProvider client={queryClient}>
      <Router>
        <header className='header'>
          <Navigation />
        </header>
        <main className='main'>
          <Content />
        </main>
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
}

export default App;
