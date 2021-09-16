import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'components/pages/Home';
import Login from 'components/pages/Login';
import Register from 'components/pages/Register';
import Profiles from 'components/pages/Profiles';
import Profile from 'components/pages/Profile';
import Articles from 'components/pages/Articles';
import Article from 'components/pages/Article';
import MyProfile from 'components/pages/MyProfile';
import PrivateRoute from 'helpers/PrivateRoute';
import MyArticles from 'components/pages/MyArticles';
import NotFound from 'components/pages/NotFound';
import SendEmail from 'components/pages/SendEmail';
import ResetPassword from 'components/pages/ResetPassword';
import ActivateMessage from 'components/pages/ActivateMessage';
import ResetMessage from 'components/pages/ResetMessage';
import ChangePassword from 'components/pages/ChangePassword';
import AccountMessage from 'components/pages/AccountMessage';
import Messenger from 'components/pages/Messenger';

const Content = () => {
  return (
    <Switch>
      <Route path='/' component={Home} exact />
      <Route path='/login' component={Login} exact />
      <Route path='/register' component={Register} exact />
      <Route path='/profiles' component={Profiles} exact />
      <Route path='/profile/:id' component={Profile} exact />
      <PrivateRoute path='/profile' component={MyProfile} exact />
      <Route path='/articles' component={Articles} exact />
      <Route path='/article/:id' component={Article} exact />
      <PrivateRoute path='/article' component={MyArticles} exact />
      <Route path='/activateMessage' component={ActivateMessage} exact />
      <Route path='/resetMessage' component={ResetMessage} exact />
      <Route path='/accountMessage' component={AccountMessage} exact />
      <Route path='/email' component={SendEmail} exact />
      <Route path='/reset/:token' component={ResetPassword} exact />
      <PrivateRoute path='/change' component={ChangePassword} exact />
      <Route path='/messenger' component={Messenger} exact />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Content;