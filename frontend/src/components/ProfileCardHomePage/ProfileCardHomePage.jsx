import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import FollowersModal from "../FollowersModal/FollowersModal"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context"
import { Row } from "react-bootstrap"
import { Storage } from "../../backend/storage/uploadFile"
import axios from 'axios'
import "./ProfileCard.css";
import { toast } from "react-toastify"
import { domain } from "../../constants/constants"
const storage = new Storage()

const ProfileCardHomePage = ({ location }) => {
  const { appInfo, setAppInfo } = useContext(AppContext)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false)
  const [introEdit, setIntroEdit] = useState(false)
  const user = firebase.auth().currentUser
  const navigate = useNavigate()
  const posts = []
  //const [modalOpened, setModalOpened] = useState(false);
  const [followersModalOpened, setFollowersModalOpened] = useState(false);
  const [followingModalOpened, setFollowingModalOpened] = useState(false);


  const updateUserInfo = async (object) => {

    let data = JSON.stringify(object)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/user/update`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    try {

      await axios.request(config)
      //alert('successfully updated')
      toast('sucessfully uploaded')
      setIntroEdit(false)
      appInfo.userInfo = { ...appInfo.userInfo, ...object }
      setAppInfo({ ...appInfo })
    } catch (ex) {
      alert(ex)
    }

  }


  const onClickEditCover = () => {
    document.getElementById('coverFile').click()
  }

  const onClickEditProfile = () => {
    document.getElementById('profileFile').click()
  }


  const updateCover = async (e) => {
    setUploadingCover(true)
    const file = e.target.files[0]
    if (file) {
      const result = await storage.uploadImage(`users/${appInfo.userInfo.id}/cover`, 'image/jpeg', file)
      const link = result.downloadLink
      await updateUserInfo({ id: appInfo.userInfo.id, coverPicture: link })
      setUploadingCover(false)
    }

  }


  const updateProfilePic = async (e) => {
    setUploadingProfilePic(true)
    const file = e.target.files[0]
    if (file) {
      const result = await storage.uploadImage(`users/${appInfo.userInfo.id}/cover`, 'image/jpeg', file)
      const link = result.downloadLink
      await updateUserInfo({ id: appInfo.userInfo.id, profilePicture: link })
      setUploadingProfilePic(false)
    }
  }




  const showProfilePage = () => {
    appInfo.profileUser = appInfo.userInfo
    appInfo.postsForPage = 'profile'
    setAppInfo({ ...appInfo })

    setTimeout(() => {
      navigate(`/profile/${appInfo.profileUser.id}?type=user`)
    }, 1000)
  }


  const own = window.location.href.includes('user') ? true : false

  return (
    <div className="ProfileCard">

      <div className="ProfileImages">

        <div style={{ position: 'relative' }} >

          <img className="cover" src={appInfo.userInfo.coverPicture} alt="CoverImage" />

          {own && <button style={{ position: 'absolute', right: '15px', bottom: '15px' }} className="button ps-button" onClick={() => { onClickEditCover() }} >
            {uploadingCover ? 'uploading' : 'Edit Cover'}

          </button>}
        </div>

        <div className="ProfileImages" style={{ position: 'relative' }} >
          <img className="profilePic" src={appInfo.userInfo.profilePicture.toString()} alt={appInfo.userInfo.profilePicture} />
          {own && <button style={{ position: 'absolute', right: '15px', bottom: '15px' }} className="button ps-button" onClick={() => { onClickEditProfile() }}>

            {uploadingCover ? 'uploading' : 'Edit Picture'}
          </button>}
        </div>

      </div>


      <div className="ProfileName">
        <span>{appInfo.userInfo.username}</span>

        <Row style={{ width: '50%' }} >
          {!introEdit && <div style={{ width: own ? '70%' : '100%', textAlign: 'center' }} >{appInfo.userInfo.about ? appInfo.userInfo.about : 'Write about yourself'}</div>}

          {introEdit &&
            <input style={{ width: '70%' }} placeholder={appInfo.userInfo.about ? appInfo.userInfo.about : 'Write about yourself'} onKeyUp={(e) => { if (e.key === 'Enter') updateUserInfo({ id: appInfo.userInfo.id, about: e.target.value }) }} />
          }

          {own &&
            <button style={{ width: '55px', height: '25px' }} className="button ps-button" onClick={() => { setIntroEdit(true) }}>
              Edit
            </button>
          }
        </Row>

      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{appInfo.userInfo.followers.length}</span>
            <span onClick={() => setFollowersModalOpened(true)} style={{ cursor: 'pointer' }}>Followers</span>

            <FollowersModal
              modalOpened={followersModalOpened}
              setModalOpened={setFollowersModalOpened}
              followers={'user.followers'}
            />


          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{appInfo.userInfo.following.length}</span>
            <span onClick={() => setFollowingModalOpened(true)} style={{ cursor: 'pointer' }}>Following</span>





          </div>

          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{
                  appInfo.myPostsCount
                }</span>
                <span>Posts</span>
              </div>{" "}
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span onClick={showProfilePage} >
          My Profile
        </span>
      )}

      <input id="coverFile" style={{ display: 'none' }} type="file" onChange={(e) => { updateCover(e) }} />
      <input id="profileFile" style={{ display: 'none' }} type="file" onChange={(e) => { updateProfilePic(e) }} />

    </div>
  )
}

export default ProfileCardHomePage
