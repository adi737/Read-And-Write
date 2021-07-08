import api from "helpers/api"
import { DispatchType, EducationFormState, ExperienceFormState, MediaFormState, ProfileFormState, SkillsFormState, StatusFormState } from "interfaces";
import { GET_PROFILES, GET_PROFILE, CLEAN_PROFILE, DELETE_PROFILE, UPDATE_PROFILE, ADD_EXPERIENCE, REMOVE_EXPERIENCE, ADD_EDUCATION, REMOVE_EDUCATION, NO_PROFILE, PROFILE_ERROR_ALERT, PROFILE_RESET_ERROR_ALERT } from "./types";


export const getProfiles = () => async (dispatch: DispatchType) => {
  try {
    const res = await api.get('/profile/profiles');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const getProfileById = (id: string, push: Function) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.get(`/profile/${id}`);

    dispatch({
      type: GET_PROFILE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data)
    push('/notFound')
  }
}

export const getYourProfile = () => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.get('/profile');
    dispatch({
      type: GET_PROFILE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: NO_PROFILE
    });
  }
}

export const cleanProfileState = () => (dispatch: DispatchType) => {
  try {
    dispatch({
      type: CLEAN_PROFILE,
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const createProfile = (formData: ProfileFormState, push: Function, id: string, setLoading: Function) => async (dispatch: DispatchType) => {
  try {
    await api.post('/profile', formData);

    setLoading(false);
    push(`/profile`)
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: PROFILE_ERROR_ALERT,
      payload: {
        errors: error.response.data.errors,
        id
      }
    });
    setLoading(false);

    setTimeout(() => dispatch({ type: PROFILE_RESET_ERROR_ALERT, payload: id }), 10000);
  }
}

export const updateProfile = (formData: MediaFormState | SkillsFormState | StatusFormState, setFormData: Function, id: string, onHide: Function, setLoading: Function) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.patch('/profile', formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: data
    });

    onHide();
    setLoading(false);

    const props = ['skills', 'linkedin', 'facebook', 'instagram', 'youtube', 'twitter']

    if (props.every(prop => !formData.hasOwnProperty(prop))) {
      setFormData({});
    }
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: PROFILE_ERROR_ALERT,
      payload: {
        errors: error.response.data.errors,
        id
      }
    });
    setLoading(false);

    setTimeout(() => dispatch({ type: PROFILE_RESET_ERROR_ALERT, payload: id }), 10000);
  }
}

export const addExperience = (formData: ExperienceFormState, setFormData: Function, id: string, onHide: Function, setLoading: Function) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.post('/profile/experience', formData);

    dispatch({
      type: ADD_EXPERIENCE,
      payload: data
    });

    onHide();
    setLoading(false);

    setFormData({});
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: PROFILE_ERROR_ALERT,
      payload: {
        errors: error.response.data.errors,
        id
      }
    });
    setLoading(false);

    setTimeout(() => dispatch({ type: PROFILE_RESET_ERROR_ALERT, payload: id }), 10000);
  }
}

export const removeExperience = (id: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.delete(`/profile/experience/${id}`);

    dispatch({
      type: REMOVE_EXPERIENCE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const addEducation = (formData: EducationFormState, setFormData: Function, id: string, onHide: Function, setLoading: Function) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.post('/profile/education', formData);

    dispatch({
      type: ADD_EDUCATION,
      payload: data
    });
    setLoading(false);

    onHide();
    setFormData({});
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: PROFILE_ERROR_ALERT,
      payload: {
        errors: error.response.data.errors,
        id
      }
    });
    setLoading(false);

    setTimeout(() => dispatch({ type: PROFILE_RESET_ERROR_ALERT, payload: id }), 10000);
  }
}

export const removeEducation = (id: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.delete(`/profile/education/${id}`);

    dispatch({
      type: REMOVE_EDUCATION,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const deleteProfile = () => async (dispatch: DispatchType) => {
  try {
    await api.delete(`/profile`);

    dispatch({
      type: DELETE_PROFILE,
    });
  } catch (error) {
    console.log(error.response.data)
  }
}