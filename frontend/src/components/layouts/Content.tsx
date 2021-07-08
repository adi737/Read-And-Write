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
import CreateProfile from 'components/forms/CreateProfile';
import CreateArticle from 'components/forms/CreateArticle';
import MyArticles from 'components/pages/MyArticles';
import UpdateArticle from 'components/forms/UpdateArticle';
import Alerts from 'helpers/Alerts';
import { useSelector } from 'react-redux';
import NotFound from 'components/pages/NotFound';
import SendEmail from 'components/pages/SendEmail';
import ResetPassword from 'components/pages/ResetPassword';
import ActivateMessage from 'components/pages/ActivateMessage';
import ResetMessage from 'components/pages/ResetMessage';
import ChangePassword from 'components/pages/ChangePassword';
import { State } from 'interfaces';

const Content = () => {
  const authErrors = useSelector((state: State) => state.user.errors);
  const profileErrors = useSelector((state: State) => state.profile.errors);
  const articleErrors = useSelector((state: State) => state.article.errors);

  return (
    <>
      {
        authErrors.length !== 0 || profileErrors.length !== 0 || articleErrors.length !== 0 ?
          <Alerts authErrors={authErrors}
            profileErrors={profileErrors}
            articleErrors={articleErrors}
          />
          :
          null
      }
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/login' component={Login} exact />
        <Route path='/register' component={Register} exact />
        <Route path='/profiles' component={Profiles} exact />
        <Route path='/profile/:id' component={Profile} exact />
        <PrivateRoute path='/profile' component={MyProfile} exact />
        <PrivateRoute path='/createProfile' component={CreateProfile} exact />
        <Route path='/articles' component={Articles} exact />
        <Route path='/article/:id' component={Article} exact />
        <PrivateRoute path='/article' component={MyArticles} exact />
        <PrivateRoute path='/createArticle' component={CreateArticle} exact />
        <PrivateRoute path='/updateArticle/:id' component={UpdateArticle} exact />
        <Route path='/activateMessage' component={ActivateMessage} exact />
        <Route path='/resetMessage' component={ResetMessage} exact />
        <Route path='/email' component={SendEmail} exact />
        <Route path='/reset/:token' component={ResetPassword} exact />
        <Route path='/change' component={ChangePassword} exact />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default Content;