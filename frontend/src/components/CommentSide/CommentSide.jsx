import React from "react";
import Comments from "../Comments/Comments";
import CommentShare from "../CommentShare/CommentShare";
import "./CommentSide.css";

const CommentSide = () => {
  return (
    <div className="CommentSide">
      <CommentShare/>
      <Comments/>
    </div>
  );
};

export default CommentSide;
