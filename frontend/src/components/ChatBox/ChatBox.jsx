import React, { useContext, useEffect, useState } from "react"
import { useRef } from "react"
import { addMessage } from "../../api/MessageRequests"
import InputEmoji from 'react-input-emoji'
import { AppContext } from "../../Context"
import Messages from "../Messages/Messages"
import _ from 'lodash'
import $ from 'jquery'
import { Image } from "react-bootstrap"
import greenPhone from '../../img/messenger/greenPhone.jpg'
import { useNavigate } from "react-router-dom"
import "./ChatBox.css"



const ChatBox = () => {

  const { appInfo, setAppInfo } = useContext(AppContext)
  const [newMessage, setNewMessage] = useState("")
  const navigate = useNavigate()

  console.log(`app Info : ${JSON.stringify(appInfo)}`)
  // alert(`app Info : chathistory : ${JSON.stringify(appInfo.chatHistory)}`)

  const handleChange = (newMessage) => {
    setNewMessage(newMessage)
  }

  // Send Message
  const handleSend = async () => {

    const message = {
      chatRoomKey: appInfo.selectedChatRoom.key,
      messageId: Math.random().toString(),
      myId: appInfo.userInfo.id,
      partnerId: appInfo.selectedChatRoom.partner.id,
      text: newMessage
    }


    try {
      await addMessage(message)
      setNewMessage("")
    }
    catch (ex) {
      console.log(`error : ${ex}`)
    }


    var down = setInterval(() => {
      var scroll = $('.chat-body')
      if (scroll) scroll.animate({ scrollTop: '1000000px' })
      if (scroll) clearInterval(down)
    }, 300)

  }

  const handleOnEnter = () => {
    handleSend()
  }



  const scroll = useRef();
  const imageRef = useRef();

  const sendCall = () => {
    // appInfo.call = true
    // appInfo.chat = false
    appInfo.callType = 'sending'
    setAppInfo({ ...appInfo })

    navigate('/live')

  }

  const recieveCall = (key) => {
    appInfo.call = true
    appInfo.chat = false
    appInfo.callType = 'recieving'
    appInfo.liveStreamingKey = key
    setAppInfo({ ...appInfo })
  }


  useEffect(() => {
    // alert(`chat history length: ${appInfo.chatHistory.length}`)
  }, [])


  return (
    <>
      <div className="ChatBox-container">
        {appInfo.chosenChat && appInfo.selectedChatRoom.partner ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower" >
                <div  >
                  <img
                    src={appInfo.selectedChatRoom.partner.photo}
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.9rem" }}>
                    <span>
                      {appInfo.selectedChatRoom.partner.name}
                    </span>
                  </div>
                </div>


                <Image style={{ wiidth: '50px', height: '50px', cursor: 'pointer', marginBottom: '20px' }} onClick={sendCall} src={greenPhone} />
                <button style={{ display: 'none' }} onClick={recieveCall} >   Recieve Call   </button>

              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}


            <Messages scroll={scroll} />

            {/* chat-sender */}
            <div className="chat-sender">

              {/* <div onClick={() => imageRef.current.click()}>+</div> */}

              <InputEmoji
                style={{ marginBottom: '15px' }}
                value={newMessage}
                onChange={handleChange}
                onEnter={handleOnEnter}
              />
              
              <div className="send-button button" onClick={handleSend}>Send</div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox