import api from "helpers/api"
import { LOGIN_USER } from "./types";
import setAuthToken from 'helpers/setAuthToken';
import { DispatchType } from "interfaces";

export const loginUser = ({ token, userID }) =>
  async (dispatch: DispatchType) => {
    dispatch({
      type: LOGIN_USER,
      payload: token,
      userID
    });
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