import * as CommentsApi from "../api/CommentsRequests";
import Comments from "../components/Comments/Comments";

export const createComment = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const { data } = await CommentsApi.createComment(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};

export const getTimelineComments = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const { data } = await CommentsApi.getTimelineComments(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};

// Nouveau code ajouté

export const deleteComment = (commentId) => async (dispatch) => {
  dispatch({ type: "DELETING_START" });
  try {
    await CommentsApi.deleteComment(commentId);
    dispatch({ type: "DELETING_SUCCESS", commentId: commentId });
  } catch (error) {
    console.log(error);
    dispatch({ type: "DELETING_FAIL" });
  }
};

export const updateComment = (commentId, updatedComment) => async (dispatch) => {
  dispatch({ type: "UPDATING_START" });
  try {
    const { data } = await CommentsApi.updatePost(commentId, updatedComment);
    dispatch({ type: "UPDATING_SUCCESS", updatedComment: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "UPDATING_FAIL" });
  }
};

/*import axios from 'axios';

// Action de création d'un commentaire
export const createComment = (commentData) => {
  return axios.post('/comments', commentData);
};

// Action de récupération d'un commentaire par son ID
export const getComment = (commentId) => {
  return axios.get(`/comments/${commentId}`);
};

// Action de mise à jour d'un commentaire
export const updateComment = (commentId, updatedCommentData) => {
  return axios.put(`/comments/${commentId}`, updatedCommentData);
};

// Action de suppression d'un commentaire
export const deleteComment = (commentId) => {
  return axios.delete(`/comments/${commentId}`);
};

// Action de like/dislake d'un commentaire
export const likeComment = (commentId) => {
  return axios.put(`/comments/${commentId}/like`);
};

// Action de récupération des commentaires de la timeline
export const getTimelineComments = (userId) => {
  return axios.get(`/comments/${userId}/timeline`);
};*/



