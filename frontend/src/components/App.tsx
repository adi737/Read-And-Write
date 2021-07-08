import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Content from 'components/layouts/Content';
import Navigation from 'components/layouts/Navigation';
import { checkIfLogged } from 'actions/user.action';
import Loader from 'helpers/Loader';
import { State } from 'interfaces';

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state: State) => state.user.loading);

  useEffect(() => {
    dispatch(checkIfLogged())
  }, [dispatch])

  return loading ?
    <Loader />
    :
    <Router>
      <header className='header'>
        <Navigation />
      </header>
      <main className='main'>
        <Content />
      </main>
    </Router>
}

export default App;
