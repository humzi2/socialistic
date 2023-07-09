import React, { useContext, useEffect, useState } from "react"
import { UilPen } from "@iconscout/react-unicons"
import ProfileModal from "../ProfileModal/ProfileModal"
import { useNavigate, useParams } from "react-router-dom"
import * as UserApi from "../../api/UserRequests.js"
import { logout } from "../../actions/AuthActions"
import firebase from 'firebase/compat/app'
import { AppContext } from "../../Context"
import { toast } from "react-toastify"
import { interact } from "../../backend/chat/chat"
import { io } from "socket.io-client"
import { domain } from '../../constants/constants.js'
import 'firebase/compat/auth'
import "./InfoCard.css"


const InfoCard = () => {

  const params = useParams()

  const { appInfo, setAppInfo } = useContext(AppContext)
  const [modalOpened, setModalOpened] = useState(false)
  const profileUserId = appInfo.profileUser.id
  const [profileUser, setProfileUser] = useState(appInfo.profileUser)
  const user = firebase.auth().currentUser
  const navigate = useNavigate()

  let urlParts = window.location.href.split('/')
  let profileId = urlParts[4].split('?')[0]

  const sendMessage = async () => {

    // off sockets
    const socket = io(domain)

    // me : user
    let me = {
      id: appInfo.userInfo.id,
      name: appInfo.userInfo.username,
      photo: appInfo.userInfo.profilePicture
    }

    // partner :  appInfo.selectedPartner
    let partner = {
      id: appInfo.selectedPartner.id,
      name: appInfo.selectedPartner.username,
      photo: appInfo.selectedPartner.profilePicture
    }

    // alert(`me : ${JSON.stringify(me)}`)
    // alert(`partner : ${JSON.stringify(partner)}`)

    const result = await interact(me, partner)
    appInfo.chatHistory = result.conversations

    console.log(`convo : ${JSON.stringify(result.conversations)}`)

    setAppInfo({ ...appInfo })

    navigate(`/chat/${partner.id}`)
    // navigate('/chat')

  }

  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>Profile Info</h4>
        {user.uid === profileUserId ? (
          <div>
            <UilPen
              width="2rem"
              height="1.2rem"
              onClick={() => setModalOpened(true)}
            />
            <ProfileModal
              modalOpened={modalOpened}
              setModalOpened={setModalOpened}
              data={user}
            />
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="info">
        {/* */}
        <span style={{ marginRight: '20px' }} >
          <b> NickName </b>
        </span>
        <span>{appInfo.profileUser.username.split(' ').length ? appInfo.profileUser.username.split(' ')[0] : appInfo.profileUser.username}</span>
      </div>
      {/* <div className="info">
        <span style={{ marginRight: '20px' }} >
          <b> Lives in </b>
        </span>
        <span style={{ font: 'italic 14px times new roman' }} >{profileUser.livesIn ? profileUser.livesIn : 'Not mentioned'}</span>
      </div> */}
      <div className="info">
        {/* <span>
          <b>Works at </b>
        </span> */}
        {/* <span>{profileUser.worksAt}</span> */}
      </div>

      {profileId !== appInfo.userInfo.id && <button className="button logout-button" onClick={sendMessage}> Message </button>}
    </div>
  )
}

export default InfoCard


