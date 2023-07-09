import Home from "../../img/home.png"
import Noti from "../../img/noti.png"
import Comment from "../../img/comment.png"
import { UilSetting } from "@iconscout/react-unicons"
import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect, useRef, useContext } from 'react'
import user01 from '../../img/user01.png'
import setting from '../../img/settings.png'
import inbox from '../../img/envelope.png'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import "./Navicons.css"
import { AppContext } from "../../Context"
import { webAuth } from '../../firebase/firebaseAuth'


const fireAuth = new webAuth()

const NavIcons = ({ location }) => {

  const { appInfo } = useContext(AppContext)

  const [notificationBarActive, setNotificationBarActive] = useState(false)
  const [settingsBarActive, setSettingsBarActive] = useState(false)


  const handleLogOut = async () => {
    console.log(`Logout :: email : ${appInfo.userInfo.email}, password : ${appInfo.userInfo.password}`)
    fireAuth.removeLoginSession(appInfo.userInfo.email, appInfo.userInfo.password)
    window.location.replace('/')
  }

  return (
    <div className="navIcons" style={{ marginRight: '15px' }} >

      <Link to="../home">
        <img src={Home} alt="" />
      </Link>

      <img src={Noti} alt={Noti} onClick={() => { setNotificationBarActive(notificationBarActive ? false : true) }} />

      <Link to="../chat">
        <img src={Comment} alt="" />
      </Link>

      <div className='menu-container'>

        <div className='menu-trigger' onClick={() => { setSettingsBarActive(settingsBarActive ? false : true) }}>
          <UilSetting style={{ cursor: "pointer", width: "1.6rem", height: "1.6rem" }} />
        </div>


        {settingsBarActive &&
          <div style={Styles.menuBar} >
            <h3> Social Istic </h3>
            <ul>

              <DropdownItem img={user01} text={"My Profile"} />

              <DropdownItem img={inbox} text={"Inbox"} />

              <hr style={{ marginRight: '40px', marginBottom: '15px' }}></hr>

              <button className="button logout-button" onClick={handleLogOut} style={{ marginTop: '-1px' }}>Log Out</button>

            </ul>

          </div>
        }

      </div>
    </div>
  );
};

function DropdownItem(props) {
  return (
    <li className='dropdownItem'>
      <img src={props.img} alt=""></img>
      <div> {props.text} </div>
    </li>
  )
}

export default NavIcons



const Styles = ({
  menuBar: {
    position: 'absolute',
    top: '50px',
    right: '12px',
    backgroundColor: '#fff',
    padding: '10px 20px',
    width: '250px',
    border: '2px solid #f4cb35',
    color: '#222'
  }
})

