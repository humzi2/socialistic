import React, { useEffect } from "react";
import Comment from "../Comment/Comment";
import "./Comments.css";
import { useParams } from "react-router-dom";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const Comments = () => {
  const params = useParams();

  var user = firebase.auth().currentUser  
  // let { posts, loading } = useSelector((state) => state.postReducer);

  // if (!posts) return "No Posts";
  // if (params.id) posts = posts.filter((post) => post.userId === params.id);

  return (
    <div className="Posts">
      {/* {loading ? (
        "Fetching posts...."
      ) : (
        posts.map((post, id) => {
          return <Comment data={post} key={id} />;
        })

      )} */}
    </div>
  );
};

export default Comments;
