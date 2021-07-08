/* eslint-disable import/no-anonymous-default-export */
import { GET_PROFILES, GET_PROFILE, CLEAN_PROFILE, DELETE_PROFILE, UPDATE_PROFILE, ADD_EXPERIENCE, REMOVE_EXPERIENCE, ADD_EDUCATION, REMOVE_EDUCATION, NO_PROFILE, PROFILE_ERROR_ALERT, PROFILE_RESET_ERROR_ALERT } from "actions/types";

const initialState = {
  profiles: [],
  profile: {
    loading: true
  },
  loading: true,
  errors: []
}

export default (state = initialState, action: { type: string; payload?: any; }) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        profile: {
          loading: true
        },
        loading: false,
        errors: []
      };
    case GET_PROFILE:
    case UPDATE_PROFILE:
    case ADD_EXPERIENCE:
    case REMOVE_EXPERIENCE:
    case ADD_EDUCATION:
    case REMOVE_EDUCATION:
      return {
        ...state,
        profile: {
          ...payload,
          loading: false
        },
        profiles: [],
        loading: true,
        errors: []
      };
    case CLEAN_PROFILE:
      return {
        ...state,
        profiles: [],
        profile: {
          loading: true
        },
        loading: true,
        errors: []
      };
    case DELETE_PROFILE:
    case NO_PROFILE:
      return {
        ...state,
        profiles: [],
        profile: {
          loading: false
        },
        loading: true,
        errors: []
      }
    case PROFILE_ERROR_ALERT:
      return {
        ...state,
        errors: [...state.errors, payload]
      }
    case PROFILE_RESET_ERROR_ALERT:
      return {
        ...state,
        errors: state.errors.filter(error => (error as { id: string }).id !== payload)
      }
    default:
      return state;
  }
}