/* eslint-disable import/no-anonymous-default-export */
import { LOGIN_USER, LOGOUT_USER, DELETE_ACCOUNT, AUTH_RESET_ERROR_ALERT, AUTH_ERROR_ALERT, CLEAN_USER } from 'actions/types'

const initialState = {
  token: localStorage.getItem('token'),
  userID: localStorage.getItem('userID'),
  isLogged: null,
  loading: true,
  errors: []
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
        errors: []
      };
    case LOGOUT_USER:
    case DELETE_ACCOUNT:
      return {
        ...state,
        token: null,
        userID: null,
        isLogged: false,
        loading: false,
        errors: []
      };
    case CLEAN_USER:
      return {
        ...state,
        errors: []
      }
    case AUTH_ERROR_ALERT:
      return {
        ...state,
        errors: [...state.errors, payload]
      }
    case AUTH_RESET_ERROR_ALERT:
      return {
        ...state,
        errors: state.errors.filter(error => (error as { id: string }).id !== payload)
      }
    default:
      return state;
  }
}