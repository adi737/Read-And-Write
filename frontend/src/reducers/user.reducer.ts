/* eslint-disable import/no-anonymous-default-export */
import { LOGIN_USER, LOGOUT_USER, DELETE_ACCOUNT } from 'reducers/types'

const initialState = {
  token: localStorage.getItem('token'),
  userID: localStorage.getItem('userID'),
  isLogged: null,
  loading: true,
}

export default (state = initialState, action: { type: string; payload?: any; userID?: string; }) => {
  const { type, payload, userID } = action;

  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        token: payload,
        userID,
        isLogged: true,
        loading: false,
      };
    case LOGOUT_USER:
    case DELETE_ACCOUNT:
      return {
        ...state,
        token: null,
        userID: null,
        isLogged: false,
        loading: false,
      };
    default:
      return state;
  }
}