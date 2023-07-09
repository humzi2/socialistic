import React, { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import { AppContext } from '../Context'
import { io } from "socket.io-client"
import { useNavigate } from 'react-router-dom'
import { Col, Form, Image, Row } from 'react-bootstrap'
import { domain } from '../constants/constants'
import { addMessage } from '../api/MessageRequests'
import greenPhone from '../img/messenger/greenPhone.jpg'
import redPhone from '../img/redCallButton.png'
import Audio from './Audio'


const ENDPOINT = domain
const socket = io(ENDPOINT, { transports: ["websocket"] })

function GlobalSocketListener() {

    const { appInfo, setAppInfo } = useContext(AppContext)
    const navigate = useNavigate()
    const [notificationData, setNotificationData] = useState(false)
    const [playAudio, setPlayAudio] = useState(false)


    const hideNotification = () => {
        setNotificationData(false)
        // alert(`notify data : ${JSON.stringify(notificationData)}`)
    }

    const updateAppState = () => {
        console.log(`notify:update state: ${JSON.stringify(notificationData)}`)
        appInfo.call = notificationData.liveStreamingKey ? true : false
        appInfo.chat = notificationData.liveStreamingKey ? false : true
        appInfo.callType = 'recieving'
        appInfo.liveStreamingKey = notificationData.liveStreamingKey
        appInfo.selectedChatRoom.key = notificationData.chatRoomKey
        appInfo.selectedChatRoom.partner = {}
        appInfo.selectedChatRoom.partner.id = notificationData.partnerId
        appInfo.streamingData = notificationData
        // alert(`update : live : ${notificationData.liveStreamingKey}, key: ${notificationData.chatRoomKey} | ${JSON.stringify(notificationData)}`)
        setAppInfo({ ...appInfo })
    }

    const socketListener = () => {

        // alert('socket listener')

        socket.on('message', (data) => {

            // alert(`global message listener : ${JSON.stringify(data.fullDocument)}`)

            var user = data.fullDocument
            if (data && Object.keys(data).length && !user.liveStreamingKey) {
                if (!window.location.href.includes('chat')) setNotificationData({ prompt: `A user sent you a message`, type: 'message', ...user })
            }

            if (data && Object.keys(data).length && data.fullDocument.liveStreamingKey) {
                setNotificationData({ prompt: `A user is calling you`, type: 'call', ...user })
                setPlayAudio(true)
                setTimeout(() => { setPlayAudio(false) }, 7000)
            }

        })

        socket.on("disconnect", () => { console.log(socket.id) })
    }


    const onMessage = () => {
        // alert(JSON.stringify(notificationData))
        // return
        hideNotification()
        setTimeout(() => {
            if (notificationData.type !== 'call') navigate(`/chat/${notificationData.myId}`)
        }, 3000)
    }
    const onAttend = () => {
        updateAppState()
        navigate(`/live`)
    }


    const onReject = async () => {
        // addMessage
        // let pause = document.getElementById('paseButton')
        // if (pause) pause.click()

        let message = { ...notificationData, text: '${{abort call}}', abort: true }
        await addMessage(message)
        hideNotification()
    }


    const effect = () => {
        socketListener()
    }

    useEffect(effect, [])




    return (
        <div>
            {playAudio && <Audio />}
            <div>
                {notificationData && notificationData.partnerId === appInfo.userInfo.id && notificationData.text !== '${{abort call}}' && notificationData.text !== '${{end call}}' &&
                    <div style={Styles.card} onClick={onMessage}>
                        <Col style={{ padding: '0px', textAlign: 'center' }} >
                            <p style={{ color: '#222', font: '16px times new roman', marginTop: '10px' }} > {notificationData.prompt} </p>
                            {notificationData.type === 'call' &&
                                <Row>

                                    <Col lg={6} >
                                        <Image style={Styles.button} src={greenPhone} onClick={onAttend} />
                                        <Form.Text> Attend  </Form.Text>
                                    </Col>

                                    <Col lg={6} >
                                        <Image style={Styles.button} src={redPhone} onClick={onReject} />
                                        <Form.Text> Reject  </Form.Text>
                                    </Col>
                                </Row>
                            }
                        </Col>
                    </div>
                }
            </div>
        </div>
    )
}

export default GlobalSocketListener



const Styles = ({
    card: {
        position: 'absolute',
        bottom: '50px',
        right: '50px',
        width: '300px',
        height: '100px',
        boxShadow: '0px 0px 12px 2px gray',
        backgroundColor: 'white',
        color: 'limegreen',
        padding: '10px',
        font: '12px times new roman',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 1
    },
    button: {
        borderRadius: '50px',
        width: '40px',
        height: '40px',
        cursor: 'pointer'
    }
})