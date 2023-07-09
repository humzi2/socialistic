
import React, { useState, useContext, useEffect } from 'react'
import { io } from "socket.io-client"
import { domain } from '../../constants/constants.js'
import { Image, Row } from 'react-bootstrap'
import { AppContext } from '../../Context.js'
import axios from 'axios'
import _ from 'lodash'
import './TrendCard.css'


export default function TrendCard() {

    const { appInfo, setAppInfo } = useContext(AppContext)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [complete, setComplete] = useState(false)



    const emitJoin = () => {
        const socket = io(domain)
        socket.emit('joined', { userId: appInfo.userInfo.id, userName: appInfo.userInfo.username, profilePicture: appInfo.userInfo.profilePicture })
    }

    const updateLiveUsers = async () => {
        const { data } = await axios.get(`${domain}/onlineUsers`)
        const list = _.uniqBy(data, 'userId')
        setOnlineUsers([])
        setOnlineUsers([...list])
    }



    const effect = () => {
        emitJoin()
        updateLiveUsers()

        setInterval(() => {
            updateLiveUsers()
        }, 5000)
    }

    useEffect(effect, [])

    return (
        <div className="TrendCard">

            <h3> Online Users </h3>

            {onlineUsers.length > 0 && onlineUsers.map((activeUser, id) => {
                return (
                    <div className="trend" key={id}>
                        <Row style={Styles.row} >
                            <Image style={Styles.image} src={activeUser.profilePicture} roundedCircle />
                            <div style={Styles.text} >{activeUser.userName}</div>
                        </Row>
                    </div>
                )
            })}

        </div>
    )
}





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