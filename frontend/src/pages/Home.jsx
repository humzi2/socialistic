import React, { useContext, useEffect } from "react"
import PostSide from "../components/PostSide/PostSide"
import ProfileSide from "../components/profileSide/ProfileSide"
import RightSide from "../components/RightSide/RightSide"
import "./Home.css"
import { AppContext } from "../Context"
import { Row, Col, Container } from "react-bootstrap"
import CustomNavbar from "../components/Navbar/Navbar"
import GlobalSocketListener from "../listener/globalSocketListener"
import _ from 'lodash'
import { io } from "socket.io-client"
import { domain } from '../constants/constants'
import axios from 'axios'


const Home = () => {

  const { appInfo, setAppInfo } = useContext(AppContext)


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
      return user
    } catch (ex) {
      console.log(`ex : ${ex}`)
      return ex
    }
  }


  useEffect(() => {


    const ENDPOINT = domain
    const socket = io(ENDPOINT, { transports: ["websocket"] })

    socket.on('connect', () => {
      console.log(`${socket.id} is connected to socket.io`)
      socket.emit('joined', { userId: appInfo.userInfo.id, userName: appInfo.userInfo.username, profilePicture: appInfo.userInfo.profilePicture })
    })


    socket.on('onlineUsersMongoEvent', async (data) => {
      console.log(`mongo event : online users : ${JSON.stringify(data)}`)
      let docId = data.documentKey._id
      var user = await getUserByDocId(docId)
      appInfo.onlineUsers.push(user)
      setAppInfo({ ...appInfo })

      const uniqueList = _.uniqBy(appInfo.onlineUsers, '_id')
      appInfo.onlineUsers = uniqueList
      setAppInfo({ ...appInfo })

    })

    socket.open()

    appInfo.postsForPage = 'home'
    setAppInfo({ ...appInfo })

  }, [])

  return (
    <Container fluid>
      <CustomNavbar />
      <Row className="Home flex-sm-col flex-md-row flex-lg-row  flex-column">
        <Col lg={3}> <ProfileSide /> </Col>
        <Col lg={5}> <PostSide /> </Col>
        <Col lg={3} ><RightSide /></Col>
      </Row>
    </Container>
  )
}

export default Home
