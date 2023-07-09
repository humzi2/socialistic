/*import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
  });

  export const createComment = (id, userId) => API.post(`posts/comments/${id}`, { userId: userId });
  export const getTimelineComments = (id) => API.get(`/posts/${id}/comments`);
  export const likeComment = (commentId, userId, id) => API.put(`posts/${id}/comments/${commentId}/like`, { userId: userId });
  export const deleteComment = (commentId, userId, id) => API.delete(`posts/${id}/comments/${commentId}`, { userId: userId });
  export const updateComment = (commentId, userId, updatedComment, id) => API.put(`posts/${id}/comments/${commentId}`, { userId: userId, comment: updatedComment });
  export const updatePost=(id, userId)=>API.put(`posts/${id}/update`, {userId: userId});*/

/*import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});

export const createComment = (postId, comment) => API.post(`/comments/${postId}`, comment);
export const getComment = (commentId) => API.get(`/comments/${commentId}`);
export const getTimelineComments = (userId) => API.get(`/comments/timeline/${userId}`);
export const likeComment = (commentId, userId) => API.put(`/comments/${commentId}/like`, { userId });
export const deleteComment = (commentId, userId) => API.delete(`/comments/${commentId}`, { userId });
export const updateComment = (commentId, userId, updatedComment) => API.put(`/comments/${commentId}/update`, { userId, updatedComment });
export const getPostComments = (postId) => API.get(`/posts/${postId}/comments`);
export const updatePost = (postId, userId) => API.put(`/posts/${postId}/update`, { userId });*/

import axios from 'axios'
import { domain } from '../constants/constants';


const API = axios.create({ baseURL: domain });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
  });


export const createComment = (postId, comment) => API.post(`/comments/${postId}`, comment);
export const getTimelineComments= (id)=> API.get(`/comments/${id}/timeline`);
export const likeComment=(id, userId)=>API.put(`comments/${id}/like`, {userId: userId});
export const deleteComment=(id, userId)=>API.delete(`comments/${id}/delete`, {userId: userId});
export const updateComment=(id, userId)=>API.put(`comments/${id}/update`, {userId: userId});
export const updatePost = (postId, userId) => API.put(`/posts/${postId}/update`, { userId });


