import React from 'react';
import { render } from 'react-dom';
import App from 'components/App';
import * as serviceWorker from 'serviceWorker';
import configureStore from 'configureStore';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'index.scss';
import { HotModule } from 'interfaces';

export const store = configureStore('');

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
