/* eslint-disable import/no-anonymous-default-export */
import { LOGIN_USER, LOGOUT_USER, DELETE_ACCOUNT } from 'reducers/types'

const initialState = {
  token: localStorage.getItem('token'),
  userID: null,
  email: null,
  nick: null,
  avatar: null,
  date: null,
  isLogged: null,
  loading: true,
}

export default (state = initialState, action) => {
  const { type, token, userID, email, nick, avatar, date } = action;

  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        token,
        userID,
        email,
        nick,
        avatar,
        date,
        isLogged: true,
        loading: false,
      };
    case LOGOUT_USER:
    case DELETE_ACCOUNT:
      return {
        ...state,
        token: null,
        userID: null,
        email: null,
        nick: null,
        avatar: null,
        date: null,
        isLogged: false,
        loading: false,
      };
    default:
      return state;
  }
}