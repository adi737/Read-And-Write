/* eslint-disable import/no-anonymous-default-export */
import { GET_ARTICLES, GET_ARTICLE, CLEAN_ARTICLE, LIKE, DISLIKE, DELETE_ARTICLE, COMMENT, REMOVE_COMMENT, ARTICLE_ERROR_ALERT, ARTICLE_RESET_ERROR_ALERT, UPLOAD_PICTURE, DELETE_PICTURE } from 'actions/types';

const initialState = {
  articles: [] as any[],
  article: {
    loading: true
  },
  loading: true,
  errors: []
}

export default (state = initialState, action: { type: string; payload?: any; }) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ARTICLES:
      return {
        ...state,
        articles: payload,
        article: {
          loading: true
        },
        loading: false,
        errors: []
      };
    case GET_ARTICLE:
    case LIKE:
    case DISLIKE:
    case COMMENT:
    case REMOVE_COMMENT:
      return {
        ...state,
        article: {
          ...payload,
          loading: false
        },
        articles: [],
        loading: true,
        errors: []
      };
    case UPLOAD_PICTURE:
      return {
        ...state,
        article: {
          loading: true
        },
        articles: state.articles.map(article => article._id === payload.id ? payload.data : article),
        loading: false,
        errors: []
      };
    case DELETE_PICTURE:
      return {
        ...state,
        article: {
          loading: true
        },
        articles: state.articles.map(article => article._id === payload.id ? payload.data : article),
        loading: false,
        errors: []
      };
    case CLEAN_ARTICLE:
      return {
        ...state,
        articles: [],
        article: {
          loading: true
        },
        loading: true,
        errors: []
      };
    case DELETE_ARTICLE:
      return {
        ...state,
        articles: state.articles.filter(article => (article as { _id: string })._id !== payload._id),
        article: {
          loading: true
        },
        loading: false,
        errors: []
      };
    case ARTICLE_ERROR_ALERT:
      return {
        ...state,
        errors: [...state.errors, payload]
      }
    case ARTICLE_RESET_ERROR_ALERT:
      return {
        ...state,
        errors: state.errors.filter(error => (error as { id: string }).id !== payload)
      }
    default:
      return state;
  }
}
