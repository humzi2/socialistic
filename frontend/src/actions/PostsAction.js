import * as PostsApi from "../api/PostsRequests";
import Posts from  '../components/PostsHomePage/PostsHomePage'

export const getTimelinePosts = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const { data } = await PostsApi.getTimelinePosts(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};

// Nouveau code ajouté

export const deletePost = (postId) => async (dispatch) => {
  dispatch({ type: "DELETING_START" });
  try {
    await PostsApi.deletePost(postId);
    dispatch({ type: "DELETING_SUCCESS", postId: postId });
  } catch (error) {
    console.log(error);
    dispatch({ type: "DELETING_FAIL" });
  }
};

export const updatePost = (postId, updatedPost) => async (dispatch) => {
  dispatch({ type: "UPDATING_START" });
  try {
    const { data } = await PostsApi.updatePost(postId, updatedPost);
    dispatch({ type: "UPDATING_SUCCESS", updatedPost: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "UPDATING_FAIL" });
  }
};


