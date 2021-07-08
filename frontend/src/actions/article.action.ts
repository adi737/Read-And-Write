import { GET_ARTICLES, GET_ARTICLE, CLEAN_ARTICLE, LIKE, DISLIKE, DELETE_ARTICLE, COMMENT, REMOVE_COMMENT, ARTICLE_ERROR_ALERT, ARTICLE_RESET_ERROR_ALERT, UPLOAD_PICTURE, DELETE_PICTURE } from "./types";
import api from "helpers/api";
import { storage } from "firebaseSet";
import { ArticleFormState, DispatchType } from "interfaces";

export const getArticles = () => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.get('/article/articles');

    dispatch({
      type: GET_ARTICLES,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const getArticleById = (id: string, push: Function) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.get(`/article/${id}`);

    dispatch({
      type: GET_ARTICLE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data);
    push('/notFound');
  }
}

export const getYourArticles = () => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.get('/article');
    dispatch({
      type: GET_ARTICLES,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const cleanArticleState = () => (dispatch: DispatchType) => {
  try {
    dispatch({
      type: CLEAN_ARTICLE,
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const createArticle = (formData: ArticleFormState, push: Function, id: string, setLoading: Function) => async (dispatch: DispatchType) => {
  try {
    await api.post(`/article`, formData);
    setLoading(false);
    push('/article');
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: ARTICLE_ERROR_ALERT,
      payload: {
        errors: error.response.data.errors,
        id
      }
    });
    setLoading(false);

    setTimeout(() => dispatch({ type: ARTICLE_RESET_ERROR_ALERT, payload: id }), 10000);
  }
}

export const updateArticle = (id: string, formData: ArticleFormState, push: Function, uuid: string, setLoading: Function) => async (dispatch: DispatchType) => {
  try {
    await api.put(`/article/${id}`, formData);

    setLoading(false);
    push('/article');
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: ARTICLE_ERROR_ALERT,
      payload: {
        errors: error.response.data.errors,
        id: uuid
      }
    });
    setLoading(false);

    setTimeout(() => dispatch({ type: ARTICLE_RESET_ERROR_ALERT, payload: uuid }), 10000);
  }
}

export const likeArticle = (id: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.post(`/article/like/${id}`)
    dispatch({
      type: LIKE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data)
  }
}

export const dislikeArticle = (id: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.post(`/article/dislike/${id}`)
    dispatch({
      type: DISLIKE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data);
  }
}

export const commentArticle = (id: string, text: { text: string }, setText: Function, uuid: string, setLoading: Function) =>
  async (dispatch: DispatchType) => {
    try {
      const { data } = await api.post(`/article/comment/${id}`, text)
      dispatch({
        type: COMMENT,
        payload: data
      });

      setText({ text: '' });
      setLoading(false);
    } catch (error) {
      console.log(error.response.data);
      dispatch({
        type: ARTICLE_ERROR_ALERT,
        payload: {
          errors: error.response.data.errors,
          id: uuid
        }
      });
      setLoading(false);

      setTimeout(() => dispatch({ type: ARTICLE_RESET_ERROR_ALERT, payload: uuid }), 10000);
    }
  }

export const removeCommentFromArticle = (articleId: string, commentId: string, uuid: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.delete(`/article/comment/${articleId}/${commentId}`)
    dispatch({
      type: REMOVE_COMMENT,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: ARTICLE_ERROR_ALERT,
      payload: {
        errors: error.response.data.errors,
        id: uuid
      }
    });

    setTimeout(() => dispatch({ type: ARTICLE_RESET_ERROR_ALERT, payload: uuid }), 10000);
  }
}

export const likeArticleComment = (articleId: string, commentId: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.post(`/article/comment/like/${articleId}/${commentId}`)
    dispatch({
      type: LIKE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data);
  }
}

export const dislikeArticleComment = (articleId: string, commentId: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.post(`/article/comment/dislike/${articleId}/${commentId}`)
    dispatch({
      type: DISLIKE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data);
  }
}

export const uploadPictureToArticle =
  (id: string, file: Blob, imgUrl: string, uuid: string, setLoading: Function) =>
    async (dispatch: DispatchType) => {
      try {
        const formData = new FormData();
        formData.append('imgUrl', imgUrl);
        formData.append('file', file);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        };

        const { data } = await api.post(`/article/upload/${id}`, formData, config);
        dispatch({
          type: UPLOAD_PICTURE,
          payload: { data, id }
        });

        setLoading(false);
      } catch (error) {
        console.log(error.response.data);
        dispatch({
          type: ARTICLE_ERROR_ALERT,
          payload: {
            errors: error.response.data.errors,
            id: uuid
          }
        });
        setLoading(false);

        setTimeout(() => dispatch({ type: ARTICLE_RESET_ERROR_ALERT, payload: uuid }), 10000);
      }
    }

export const deletePictureFromArticle = (articleId: string, pictureId: string, imgName: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.delete(`/article/upload/${articleId}/${pictureId}`);
    const imgRef = storage.ref('images').child(imgName);
    await imgRef.delete();

    dispatch({
      type: DELETE_PICTURE,
      payload: { data, id: articleId }
    });
  } catch (error) {
    console.log(error.response.data);
  }
}

export const deleteArticle = (id: string) => async (dispatch: DispatchType) => {
  try {
    const { data } = await api.delete(`/article/${id}`);

    dispatch({
      type: DELETE_ARTICLE,
      payload: data
    });
  } catch (error) {
    console.log(error.response.data)
  }
}