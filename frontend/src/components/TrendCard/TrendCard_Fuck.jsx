import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context.js'
import { Image, Row } from 'react-bootstrap'
import { io } from "socket.io-client"
import { domain } from '../../constants/constants.js'
import axios from 'axios'
import _ from 'lodash'
import './TrendCard.css'


const TrendCard = () => {

  const { appInfo, setAppInfo } = useContext(AppContext)
  const [complete, setComplete] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])


  const getOnlineUsers = async () => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${domain}/user`,
      headers: {}
    };


    try {
      const response = await axios.request(config)
      let users = response.data
      console.log(JSON.stringify(users))
      let onlines = users.filter((user) => { return user.online === true })
      return onlines
    } catch (error) {
      alert(error)
      setComplete(true)
      return []
    }
  }



  const getUserByDocId = async (id) => {

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/user/findByDocId?id=${id}`,
      headers: {}
    }

    try {
      const response = await axios.request(config)
      let user = response.data
      console.log(`user by doc id : ${JSON.stringify(user)}`)
      // alert(`user by doc id : ${JSON.stringify(user)}`)
      return user
    } catch (ex) {
      console.log(`ex : ${ex}`)
      return ex
    }
  }


  const getMyChatHistory = () => {

    alert('get history')

    let data = JSON.stringify({
      "me": {
        "id": appInfo.userInfo.id,
        "name": appInfo.userInfo.username,
        "photo": appInfo.userInfo.profilePicture
      }
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/chat/myChatHistory?`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        appInfo.chatHistory = response.data.conversations
        alert(`convos : ${response.data.conversations}`)
        setAppInfo({ ...appInfo })
      })
      .catch((error) => {
        console.log(error);
      });

  }

  useEffect(() => {

    const ENDPOINT = domain
    const socket = io(ENDPOINT)

    socket.on('connect', () => {
      console.log(`${socket.id} is connected to socket.io`)
      socket.emit('joined', { userId: appInfo.userInfo.id, userName: appInfo.userInfo.username, profilePicture: appInfo.userInfo.profilePicture })
    })


    socket.on('onlineUsersMongoEvent', async (data) => {

      // alert(`mongo event : online users : ${JSON.stringify(data)}`)

      console.log(`online event : chathistory : ${JSON.stringify(appInfo.chatHistory)}`)
      alert(`online event : chathistory : ${JSON.stringify(appInfo.chatHistory)}`)


      let docId = data.documentKey._id
      var user = await getUserByDocId(docId)
      onlineUsers.push(user)



      if (!complete) {
        setComplete(true)
        const preOnlines = await getOnlineUsers()
        preOnlines.forEach((user) => { onlineUsers.push(user) })
      }

      if (!user.online) {
        let userIndex = -1
        onlineUsers.forEach((listItem, index) => { if (user.id === listItem.id) userIndex = index })
        if (userIndex >= 0) onlineUsers.splice(userIndex, 1)
        // alert(`offline : index : ${userIndex} | ${appInfo.onlineUsers.length}`)
      }

      const uniqueList = _.uniqBy(onlineUsers, '_id')
      setOnlineUsers([...uniqueList])


    })

    socket.open()

    return () => {
      //  alert('off')
      socket.off('onlineUsersMongoEvent')
      socket.removeAllListeners('onlineUsersMongoEvent')
      socket.close()
    }

  }, [])


  return (
    <div className="TrendCard">

      <h3> Online Users </h3>

      {onlineUsers.length > 0 && onlineUsers.map((activeUser, id) => {
        return (
          <div className="trend" key={id}>
            <Row style={Styles.row} >
              <Image style={Styles.image} src={activeUser.profilePicture} roundedCircle />
              <div style={Styles.text} >{activeUser.username}</div>
            </Row>
          </div>
        )
      })}

    </div>
  )
}

export default TrendCard


const Styles = ({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: '57px',
    height: '35px',
    borderRadius: '50px',
    cursor: 'pointer'
  },
  text: {
    width: '130px',
    font: '12px times new roman',
    cursor: 'pointer'
  }
})