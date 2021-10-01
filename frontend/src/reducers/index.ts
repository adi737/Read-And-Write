import { combineReducers } from 'redux';
import user from './user.reducer';
import onlineUsers from './onlineUsers.reducer';

export default combineReducers({
  user,
  onlineUsers
});