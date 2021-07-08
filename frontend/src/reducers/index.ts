import { combineReducers } from 'redux';
import profile from './profile.reducer';
import article from './article.reducer';
import user from './user.reducer';

export default combineReducers({
  profile,
  article,
  user
});