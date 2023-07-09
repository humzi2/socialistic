import React, { useContext, useEffect, useState } from "react"
import PostSide from "../../components/PostSide/PostSide"
import ProfileCard from "../../components/ProfileCard/ProfileCard"
import ProfileLeft from "../../components/ProfileLeft/ProfileLeft"
import RightSide from "../../components/RightSide/RightSide"
import { Row, Col, Container } from "react-bootstrap"
import ProfileCardUser from "../../components/ProfileCardUser/ProfileCardUser"
import CustomNavbar from "../../components/Navbar/Navbar"
import { AppContext } from "../../Context"
import "./Profile.css"
import Loading from "../../components/Loading/Loading"
import { domain } from "../../constants/constants"
import axios from 'axios'

const Profile = () => {

  const { appInfo, setAppInfo } = useContext(AppContext)

  const getUserDataById = () => {

    let uriParts = window.location.href.split('/')
    let userId = uriParts[uriParts.length - 1]

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${domain}/user/${userId}`,
      headers: {}
    }

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        appInfo.profileUser = response.data.user
        setAppInfo({ ...appInfo})
      })
      .catch((error) => {
        console.log(error);
      })
  }


  useEffect(() => {
    appInfo.postsForPage = 'profile'
    setAppInfo({ ...appInfo })
    if (!appInfo.profileUser.id) getUserDataById()
  }, [])

  if (appInfo.profileUser.id) {
    return (
      <div className="Profile">
        <CustomNavbar />
        <Container fluid>
          <Row>
            <Col lg={3}> <ProfileLeft /> </Col>
            <Col lg={7}>  <div className="Profile-center">
              {window.location.href.includes('user') ? <ProfileCardUser /> : <ProfileCard location='profilePage' />}
              <PostSide />
            </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  } else {
    return <Loading />
  }

}

export default Profile
