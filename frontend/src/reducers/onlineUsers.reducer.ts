/* eslint-disable import/no-anonymous-default-export */

import { SET_USERS } from "./types";

const initialState = []

export default (state = initialState, action: {
  type: string;
  payload?: any;
}) => {
  const { type, payload } = action;

  switch (type) {
    case SET_USERS:
      return payload;
    default:
      return state;
  }
}