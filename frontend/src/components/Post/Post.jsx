import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import moment from "moment";
import "./Post.css";
import Com from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useNavigate } from "react-router-dom";
import edit from '../../img/edit.png';
import ShareModal from "../ShareModal/ShareModal";
import { deletePost, updatePost } from "../../api/PostsRequests";
import { getUserById } from "../../api/UserRequests";
import CommentShare from '../CommentShare/CommentShare.jsx';
import Comment from "../Comment/Comment";
import { createComment } from "../../api/CommentsRequests";
import axios from 'axios'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context";
import { domain } from "../../constants/constants";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';


const Post = ({ data, posts, setPosts }) => {
  const { appInfo, setAppInfo } = useContext(AppContext)
  const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY })
  var user = firebase.auth().currentUser

  const [liked, setLiked] = useState(data.likes.includes(appInfo.userInfo.id))
  const [likes, setLikes] = useState(data.likes.length);
  const [showdrop, setshowdrop] = useState(false);
  const navigate = useNavigate();

  const [comments, setComments] = useState(data.comments ? data.comments : [])

  const [isShare, setIsShare] = useState(false);
  const [isCommentInputVisible, setIsCommentInputVisible] = useState(false)
  const [comment, setComment] = useState("")

  const totalItems = data.images.length + data.videos.length + data.locations.length + data.dates.length
  let itemCount = 0



  const handleToggleCommentInput = () => {
    setIsCommentInputVisible((prev) => !prev);
    setComment(""); // Réinitialiser le commentaire lors du basculement de l'entrée de commentaire
  }


  const handleLike = () => {

    let postData = JSON.stringify({
      "userId": appInfo.userInfo.id,
      "postId": data._id
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/posts/like`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: postData
    }

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        posts.forEach((post) => {
          if (post._id === data._id) {
            if (!liked) post.likes.push(appInfo.userInfo.id)
            if (liked) post.likes.splice(0, 1)
          }
        })
        setPosts([...posts])
      })
      .catch((error) => {
        console.log(error);
      })

    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)

  }


  const handleDelete = () => {
    setshowdrop(false);
    navigate('/')
  };

  const handleUpdate = () => {
    const updatedPost = { ...data, edit: true, title: "Updated Title" };
    // dispatch(updatePost(data.id, updatedPost));
    setshowdrop(false);
  };


  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setshowdrop(false);
  }


  const [open, setOpen] = useState(false);
  let menuRef = useRef();



  const handleVideoEnd = (event) => {
    event.target.currentTime = 0
  }


  const media = (
    <div style={Styles.flexView} >
      {data.images &&
        <div style={{ width: '100%' }} >
          {data.images.map((image) => {
            itemCount++
            return (
              <img
                key={Math.random()}
                style={{ width: '100%', height: '400px', margin: '1px', cursor: 'pointer' }}
                onClick={() => { window.open(image, '_blank') }}
                src={image}
                alt={image}
              />
            )
          })}
        </div>
      }

      {data.videos &&
        <div style={{ width: '100%' }}>
          {data.videos.map((video) => {
            return (
              <video key={Math.random()} style={{ width: '100%', height: '400px', margin: '1px', cursor: 'pointer' }} controls onEnded={handleVideoEnd} src={video} >

              </video>
            )
          })}
        </div>
      }



      {data.locations &&
        <div>
          {data.locations.map((location) => {
            return (
              <div style={{ width: 'auto', height: 'auto' }} key={Math.random()} >
                {isLoaded &&
                  <div style={{ width: '550px', height: '400px' }} >
                    <GoogleMap
                      mapContainerStyle={{ width: '550px', height: '400px' }}
                      center={{ lat: location.latitude, lng: location.longitude }}
                      zoom={10}
                    />
                  </div>
                }
              </div>
            )
          })}
        </div>
      }

      {data.dates &&
        <div>
          {data.dates.map((dateString) => {
            let jsDate = moment(dateString, 'YYYY-MM-DD').toDate()
            return (
              <Calendar value={jsDate} key={Math.random()} />
            )
          })}
        </div>
      }

    </div>
  )
  // if (data.text) alert(`${JSON.stringify(data)}`)

  return (
    <div className="Post">
      <div className="Postheader">
        <div className="PostInfo">
          {user.id === data?.userId ?
            <img
              src={data.profilePicture}
              alt="ProfileImage"
            /> :
            <img
              src={data.profilePicture}
              alt="ProfileImage"
            />}
          <div className="PostInfoUser">
            <span className="user">
              {data.username}
            </span>


            <span className="timeago">
              {moment.utc(data.createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div className="postcardheaderdown">

          {window.location.href.includes('profile') && <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
            <p onClick={() => setshowdrop(!showdrop)}>ooo</p>
            <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} style={{ marginRight: '-12px' }} >
              <ul>
                <DropdownItem img={edit} text={"Edit"} onClick={() => handleUpdate(data)} />
                <DropdownItem img={edit} text={"Remove Post"} onClick={handleDelete} />
                <DropdownItem img={edit} text={"Download"} onClick={handleCopyLink} />
              </ul>
            </div>
          </div>}


        </div>
      </div>
      <div className="detail" style={{ alignSelf: "flex-start" }}>
        <span>{data.text}</span>
      </div>
      {media}
      <div className="postReact">

        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />

        <img src={Com} alt="" style={{ cursor: 'pointer' }} onClick={handleToggleCommentInput} />

        {/* <img src={Share} alt="" onClick={() => setIsShare(!isShare)} style={{ cursor: 'pointer' }} /> */}

      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px", alignSelf: "flex-start" }}>
        {data.likes.length} likes
      </span>

      {isCommentInputVisible && (
        <>
          {<CommentShare postId={data._id} visible={setIsCommentInputVisible} />}
        </>
      )}


      {comments.map((item) => (
        <Comment key={item.id} data={item} />
      ))}


    </div>
  )
}


function DropdownItem(props) {
  return (
    <li className='dropdownItem'>
      <img src={props.img} alt=""></img>
      <span> {props.text} </span>
    </li>
  );
}

export default Post


const Styles = ({
  flexView: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '550px',
  }
})


