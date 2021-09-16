import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'components/layouts/Content';
import Navigation from 'components/layouts/Navigation';
// import { checkIfLogged } from 'actions/user.action';
import Loader from 'helpers/Loader';
import { State } from 'interfaces';
import { QueryClientProvider, QueryClient } from 'react-query';
import setAuthToken from 'helpers/setAuthToken';
import { LOGIN_USER } from 'reducers/types';
import api from 'helpers/api';
// import { ReactQueryDevtools } from 'react-query/devtools'

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state: State) => state.user.loading);

  const checkIfLogged = useCallback(async () => {
    setAuthToken({
      token: localStorage.getItem('token')!,
      userID: localStorage.getItem('userID')!
    });

    try {
      await api.get('/user');
      dispatch({
        type: LOGIN_USER,
        payload: localStorage.getItem('token'),
        userID: localStorage.getItem('userID')
      });

    } catch (error: any) {
      console.log(error.response.data)
    }
  }, [dispatch]);

  useEffect(() => {
    checkIfLogged()
  }, [checkIfLogged])

  const queryClient = new QueryClient()

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
