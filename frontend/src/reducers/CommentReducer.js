const commentReducer = (state = { comments: null, loading: false, error: false }, action) => {
  switch (action.type) {
    case "CREATE_COMMENT_START":
      return { ...state, loading: true, error: false };
    case "CREATE_COMMENT_SUCCESS":
      return {
        ...state,
        comments: [action.comment, ...state.comments],
        loading: false,
        error: false,
      };
    case "CREATE_COMMENT_FAIL":
      return { ...state, loading: false, error: true };
    case "GET_COMMENT_START":
      return { ...state, loading: true, error: false };
    case "GET_COMMENT_SUCCESS":
      return { ...state, comments: action.comments, loading: false, error: false };
    case "GET_COMMENT_FAIL":
      return { ...state, loading: false, error: true };
    case "UPDATE_COMMENT_START":
      return { ...state, loading: true, error: false };
    case "UPDATE_COMMENT_SUCCESS":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.updatedComment._id ? action.updatedComment : comment
        ),
        loading: false,
        error: false,
      };
    case "UPDATE_COMMENT_FAIL":
      return { ...state, loading: false, error: true };
    case "DELETE_COMMENT_START":
      return { ...state, loading: true, error: false };
    case "DELETE_COMMENT_SUCCESS":
      return {
        ...state,
        comments: state.comments.filter((comment) => comment._id !== action.commentId),
        loading: false,
        error: false,
      };
    case "DELETE_COMMENT_FAIL":
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};

export default commentReducer;
