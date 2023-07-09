import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../actions/UserAction";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context";
import axios from 'axios'
import { domain } from "../../constants/constants";
import { toast } from "react-toastify";


const User = ({ person }) => {
  const { appInfo, setAppInfo } = useContext(AppContext)
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const user = firebase.auth().currentUser

  const [following, setFollowing] = useState(person.followers.includes(appInfo.userInfo.id))


  const updatePosts = () => {
    appInfo.updatePostsByFollowed = true
    setAppInfo({ ...appInfo })

    setTimeout(() => {
      appInfo.updatePostsByFollowed = false
      setAppInfo({ ...appInfo })
    }, 10000)

  }



  const notify = (person, action) => {

    let data = JSON.stringify({
      "id": person.id,
      "text": `${appInfo.userInfo.username} has ${action} you`
    })
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/notify`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    }
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    })
    
  }


  const follow = (myId, followId) => {


    let data = JSON.stringify({
      "myId": myId,
      "follow": followId
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/user/follow`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }


    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success(`followed ${person.username}`)
        notify(person, 'followed')
      })
      .catch((error) => {
        console.log(error);
      })

  }



  const unfollow = (myId, unfollowId) => {
    let data = JSON.stringify({
      "myId": myId,
      "unfollow": unfollowId
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/user/unfollow`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };


    // alert(`me : ${JSON.stringify(myId)} , unfollow : ${JSON.stringify(unfollowId)}`)
    // console.log(`follow user : ${JSON.stringify(followUser)}`)
    // return


    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        toast.success(`unfollowed ${person.username}`)
        notify(person, 'unfollowed')
      })
      .catch((error) => {
        console.log(error);
      })

  }


  const handleFollow = () => {
    setFollowing((prev) => !prev)
    if (!following) appInfo.userInfo.following.push(1)
    if (following && appInfo.userInfo.following) appInfo.userInfo.following.splice(0, 1)
    setAppInfo({ ...appInfo })

    if (following) unfollow(appInfo.userInfo.id, person.id)
    if (!following) follow(appInfo.userInfo.id, person.id)
  }


  return (
    <div className="follower">
      <div >
        <img
          src={"https://e7.pngegg.com/pngimages/18/809/png-clipart-user-computer-icons-person-icon-cdr-logo-thumbnail.png"}
          className="followerImage"
        />
        <div className="name">
          <span>{person.firstname}</span>
          <span>@{person.username}</span>
        </div>
      </div>
      <button
        className={
          following ? "button fc-button" : "button fc-button UnfollowButton"
        }
        onClick={handleFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default User;
