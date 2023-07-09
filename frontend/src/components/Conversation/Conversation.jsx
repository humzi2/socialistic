import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { getUser } from "../../api/UserRequests";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context";
import { addMessage, getMessages } from "../../api/MessageRequests"
import $ from 'jquery'

const Conversation = ({ data, userId, online }) => {

  const { appInfo, setAppInfo } = useContext(AppContext)
  const [chosenChat, setChosenChat] = useState(false)


  const fetchMessages = async (id) => {
    try {
      var { data } = await getMessages(id)
      data = data.filter((item) => { return item.text !== 'call Request' && item.text !== 'call request' })
      appInfo.chosenChat = true
      appInfo.messages = data
      // alert(`selected :: ${appInfo.selectedChatRoom.key}`)
      setAppInfo({ ...appInfo })
    } catch (error) {
      alert(error);
    }
    //    setLoadedHistory(true)
    console.log(`nice`);
  }


  const selectConversation = async () => {
    // alert('select')
    appInfo.selectedChatRoom.key = data.chatRoomKey
    appInfo.selectedChatRoom._id = data.chatRoomKey
    appInfo.selectedChatRoom.partner = { id: data.partnerId, name: data.name, photo: data.photo }
    // alert(appInfo.selectedChatRoom.key)
    await fetchMessages(data.chatRoomKey)
    setAppInfo({ ...appInfo })

    var down = setInterval(() => {
      var scroll = $('.chat-body')
      if (scroll) scroll.animate({ scrollTop: '1000000px' })
      if (scroll) clearInterval(down)
    }, 300)

  }



  const chooseChat = () => {
    let urlParts = window.location.href.split('/')
    if (data.partnerId === urlParts[4]) appInfo.liveNavGoBack = `/chat/${urlParts[4]}`
    if (urlParts.length === 5 && data.partnerId === urlParts[4]) selectConversation()
  }

  const effect = () => {
    if (appInfo.chosenChat === false) chooseChat()
  }

  useEffect(effect, [])



  if (data && appInfo.userInfo && appInfo.chatHistory) {
    return (
      <>
        <div className="follower conversation" onClick={selectConversation} >
          <div>
            {/* {online && <div className="online-dot"></div>} */}
            <img
              src={data.photo}
              alt={data.photo}
              className="followerImage"
              style={{ width: "50px", height: "50px" }}
            />
            <div className="name" style={{ fontSize: '0.8rem' }}>
              <span>{data.name}</span>
              {/* <span style={{ color: online ? "#51e200" : "#222" }}>{online ? "Online" : "Offline"}</span> */}
            </div>
          </div>
        </div>
        <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
      </>
    )
  } else {
    return null
  }

}

export default Conversation

