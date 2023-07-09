const postReducer = (
  state = { posts: null, loading: false, error: false, uploading: false },
  action
) => {
  switch (action.type) {
    // belongs to PostShare.jsx
    case "UPLOAD_START":
      return { ...state, error: false, uploading: true };
    case "UPLOAD_SUCCESS":
      return { ...state, posts: [action.data, ...state.posts], uploading: false, error: false };
    case "UPLOAD_FAIL":
      return { ...state, uploading: false, error: true };
    // belongs to Posts.jsx
    case "RETREIVING_START":
      return { ...state, loading: true, error: false };
    case "RETREIVING_SUCCESS":
      return { ...state, posts: action.data, loading: false, error: false };
    case "RETREIVING_FAIL":
      return { ...state, loading: false, error: true };
    //default:
      //return state;
    case "DELETING_START":
      return { ...state, isLoading: true, error: null };
    case "DELETING_SUCCESS":
      return {
          ...state,
          isLoading: false,
          error: null,
          posts: state.posts.filter((post) => post.id !== action.postId),
        };
    case "DELETING_FAIL":
      return { ...state, isLoading: false, error: "Error while deleting post" };
    case "UPDATING_START":
      return { ...state, isLoading: true, error: null };
    case "UPDATING_SUCCESS":
      return {
          ...state,
          isLoading: false,
          error: null,
          posts: state.posts.map((post) =>
            post.id === action.updatedPost.id ? action.updatedPost : post
          ),
        };
    case "UPDATING_FAIL":
      return { ...state, isLoading: false, error: "Error while updating post" };
        default:
          return state;
    }
    
  };


/*const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RETREIVING_START":
      return { ...state, isLoading: true, error: null };
    case "RETREIVING_SUCCESS":
      return { ...state, isLoading: false, error: null, posts: action.data };
    case "RETREIVING_FAIL":
      return { ...state, isLoading: false, error: "Error while retreiving posts" };
    case "DELETING_START":
      return { ...state, isLoading: true, error: null };
    case "DELETING_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        posts: state.posts.filter((post) => post.id !== action.postId),
      };
    case "DELETING_FAIL":
      return { ...state, isLoading: false, error: "Error while deleting post" };
    case "UPDATING_START":
      return { ...state, isLoading: true, error: null };
    case "UPDATING_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        posts: state.posts.map((post) =>
          post.id === action.updatedPost.id ? action.updatedPost : post
        ),
      };
    case "UPDATING_FAIL":
      return { ...state, isLoading: false, error: "Error while updating post" };
    default:
      return state;
  }
};*/


export default postReducer;
