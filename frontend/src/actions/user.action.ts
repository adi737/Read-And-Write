import api from "helpers/api"
import { LOGIN_USER, DELETE_ACCOUNT, AUTH_RESET_ERROR_ALERT, AUTH_ERROR_ALERT, CLEAN_USER } from "./types";
import setAuthToken from 'helpers/setAuthToken';
import { ChangePasswordFormState, DispatchType, EmailState, LoginState, PasswordState, RegisterState } from "interfaces";

export const registerUser = (formData: RegisterState, id: string, history: { push: Function }, setLoading: Function) =>
  async (dispatch: DispatchType) => {
    try {
      await api.post('/user/register', formData);

      setLoading(false);
      history.push('/activateMessage')
    } catch (error) {
      console.log(error.response.data);
      dispatch({
        type: AUTH_ERROR_ALERT,
        payload: {
          errors: error.response.data.errors,
          id
        }
      });
      setLoading(false);

      setTimeout(() => dispatch({ type: AUTH_RESET_ERROR_ALERT, payload: id }), 10000);
    }
  }

export const loginUser = (formData: LoginState, id: string, setLoading: Function) =>
  async (dispatch: DispatchType) => {
    try {
      const { data: { token, userID } } = await api.post('/user/login', formData);

      dispatch({
        type: LOGIN_USER,
        payload: token,
        userID
      });
      setLoading(false);
    } catch (error) {
      console.log(error.response.data);
      dispatch({
        type: AUTH_ERROR_ALERT,
        payload: {
          errors: error.response.data.errors,
          id
        }
      });
      setLoading(false);

      setTimeout(() => dispatch({ type: AUTH_RESET_ERROR_ALERT, payload: id }), 10000);
    }
  }

export const checkIfLogged = () => async (dispatch: DispatchType) => {
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

  } catch (error) {
    console.log(error.response.data)
  }
}

export const sendLinkToResetPass = (formData: EmailState, id: string, history: { push: Function }, setLoading: Function) =>
  async (dispatch: DispatchType) => {
    try {
      await api.post('/user/send', formData);

      setLoading(false);
      history.push('/resetMessage')
    } catch (error) {
      console.log(error.response.data);
      dispatch({
        type: AUTH_ERROR_ALERT,
        payload: {
          errors: error.response.data.errors,
          id
        }
      });
      setLoading(false);

      setTimeout(() => dispatch({ type: AUTH_RESET_ERROR_ALERT, payload: id }), 10000);
    }
  }

export const resetPassword = (formData: PasswordState, id: string, history: { push: Function }, token: string, setLoading: Function) =>
  async (dispatch: DispatchType) => {
    try {
      await api.patch(`/user/reset/${token}`, formData);

      setLoading(false);
      history.push('/login')
    } catch (error) {
      console.log(error.response.data);
      dispatch({
        type: AUTH_ERROR_ALERT,
        payload: {
          errors: error.response.data.errors,
          id
        }
      });
      setLoading(false);

      setTimeout(() => dispatch({ type: AUTH_RESET_ERROR_ALERT, payload: id }), 10000);
    }
  }

export const changePassword = (formData: ChangePasswordFormState, id: string, history: { push: Function }, setLoading: Function) =>
  async (dispatch: DispatchType) => {
    try {
      await api.patch(`/user/change`, formData);

      setLoading(false);
      history.push('/login')
    } catch (error) {
      console.log(error.response.data);
      dispatch({
        type: AUTH_ERROR_ALERT,
        payload: {
          errors: error.response.data.errors,
          id
        }
      });
      setLoading(false);

      setTimeout(() => dispatch({ type: AUTH_RESET_ERROR_ALERT, payload: id }), 10000);
    }
  }

export const deleteAccount = () => async (dispatch: DispatchType) => {
  try {
    await api.delete('/user');
    dispatch({
      type: DELETE_ACCOUNT
    });

  } catch (error) {
    console.log(error.response.data);
  }
}

export const cleanUserState = () => (dispatch: (arg0: { type: string; }) => void) => {
  try {
    dispatch({
      type: CLEAN_USER,
    });
  } catch (error) {
    console.log(error.response.data)
  }
}