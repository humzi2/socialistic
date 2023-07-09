import React, { useState, useEffect } from "react";
import moment from "moment";
import "./Comment.css";
import Com from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likeComment, deleteComment, updateComment } from "../../api/CommentsRequests";
import { getUserById } from "../../api/UserRequests";
import ShareModal from "../ShareModal/ShareModal";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { domain } from "../../constants/constants";


const Comment = ({ data }) => {

  var user = firebase.auth().currentUser

  const [liked, setLiked] = useState(data.likes ? data.likes.includes(user.id) : false)
  const [likes, setLikes] = useState(data.likes ? data.likes.length : 0)
  // const dispatch = useDispatch();

  const [isShare, setIsShare] = useState(false);
  const [commentUser, setCommentUser] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);



  const fetchCurrentUser = async () => {
    try {
      const response = await getUserById(user.uid)
      setCurrentUser(response.data)
      console.log(response)
      setLoading(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCurrentUser();

  }, [])
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await getUserById(data.userId);

        setCommentUser(response.data)
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };


  }, [data.userId, user.id]);



  /* const handleLike = () => {
     // dispatch(likeComment(data._id));
     setLiked((prev) => !prev);
     liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
   }; */

  const handleDelete = () => {
    // dispatch(deleteComment(data._id));
    // Ajoutez ici la logique de suppression du commentaire dans votre application
  };

  const handleUpdate = () => {
    // Ajoutez ici la logique de mise à jour du commentaire dans votre application
  };

  const handleCopyLink = () => {
    // Ajoutez ici la logique de copie du lien dans votre application
  };


  if (loading) {
    return (<><span>...loading</span></>)
  }
  else{

  
  return (
    <div className="Comment">
      <div className="Commentheader">
        <div className="CommentInfo">
          {/* {user.id === data?.userId ? (
            <img
              src={data.profilePicture || "defaultProfile.png"}
              alt="ProfileImage"
            />
          ) : (
            <img
              src={data.profilePicture || "defaultProfile.png"}
              alt="ProfileImage"
            />
          )} */}

          <img
            src={data.profilePicture || "defaultProfile.png"}
            alt="ProfileImage"
          />


          <div className="CommentInfoUser">
            <span className="user">
              {data.username}
            </span>
            {/* <span className="timeago">
              {moment.utc(data.createdAt).fromNow()}
            </span> */}
          </div>
        </div>
        <div className="commentcardheaderdown">


          {/* <div className="menu-trigger">
            <p>ooo</p>
            <div className="dropdown-menu">
              <ul>
                <li onClick={handleUpdate}>Update Comment</li>
                <li onClick={handleDelete}>Delete Comment</li>
                <li onClick={handleCopyLink}>Copy Link</li>
              </ul>
            </div>
          </div> */}


        </div>
      </div>
      <div className="detail" style={{ alignSelf: "flex-start" }}>
        <span>
          {/* <b>{data.username}</b> */}
        </span>

        <span>{data.comment}</span>
      </div>

{/* 
      <span style={{ color: "var(--gray)", fontSize: "12px", alignSelf: "flex-start" }}>
        {likes} likes
      </span> */}

      {/* {isShare && <ShareModal url={`${domain}/comment/${data._id}`} />} */}

      </div>
    );
  }
};

export default Comment


