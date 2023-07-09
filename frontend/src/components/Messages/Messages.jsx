import React, { useContext, useRef, useEffect, useState } from 'react'
import { AppContext } from '../../Context'
import _ from 'lodash'
import $ from 'jquery'
import { io } from "socket.io-client"
import { domain } from '../../constants/constants'
import moment from 'moment'
const ENDPOINT = domain
const socket = io(ENDPOINT, { transports: ["websocket"] })

function Messages() {
    const { appInfo, setAppInfo } = useContext(AppContext)

    const socketListener = () => {
        appInfo.listening = true
        setAppInfo({ ...appInfo })
        // alert(`socket listener : ${listening}`)
        socket.on('message', (data) => {
            // alert(`on message :  ${JSON.stringify(data.fullDocument)}`)
            if (data && Object.keys(data).length && !data.fullDocument.liveStreamingKey && !data.fullDocument.abort) {
                // alert(`${data.fullDocument}`)
                let list = appInfo.messages
                let nm = data.fullDocument
                if (nm.text !== 'call Request') list.push(nm)
                // alert(`new message : ${JSON.stringify(nm)}`)
                list = _.uniqBy(list, '_id')
                appInfo.messages = list
                setAppInfo({ ...appInfo })
            }

            var down = setInterval(() => {
                var scroll = $('.chat-body')
                if (scroll) scroll.animate({ scrollTop: '1000000px' })
                if (scroll) clearInterval(down)
            }, 300)
        })



        // alert(`mongo ? ${listenToMongo}  roomKey : ${appInfo.selectedChatRoom.key}`)
        if (!appInfo.listenToMongo && appInfo.selectedChatRoom.key) {
            // alert('emit listen')
            socket.emit('listen', { chatRoomKey: appInfo.selectedChatRoom.key })
            appInfo.listenToMongo = true
            setAppInfo({ ...appInfo })
        }

        socket.on("disconnect", () => { console.log(socket.id) })

    }

    useEffect(() => {
        // var scroll = $('.chat-body');
        // scroll.animate({ scrollTop: '8000px' })
        if (!appInfo.listening) socketListener()
    }, [])


    return (
        <div className='chat-body'>
            {appInfo.messages.map((message) => {

                if (!message.text.includes('${{') && !message.text.includes('}}')) {
                    return (
                        <div key={Math.random()} style={{ display: 'flex', justifyContent: message.myId === appInfo.userInfo.id ? 'flex-start' : 'flex-end' }} >
                            <div id="message" className={message.myId === appInfo.userInfo.id ? "message own" : "message"} >
                                <span>{message.text}</span>{" "}
                                {/* <span>{format(message.createdAt)}</span> */}
                            </div>
                        </div>
                    )
                }


                if (message.text === '${{abort call}}') {
                    return (
                        <div key={Math.random()} style={{ display: 'flex', justifyContent: message.myId === appInfo.userInfo.id ? 'flex-start' : 'flex-end' }} >
                            <div id="message" className={'callAborted'} >
                                <span>{'live call was aborted'}</span>{" "}
                                <span>{moment(message.createdAt).fromNow(true)}</span>
                            </div>
                        </div>
                    )
                }

                if (message.text === '${{end call}}') {
                    return (
                        <div key={Math.random()} style={{ display: 'flex', justifyContent: message.myId === appInfo.userInfo.id ? 'flex-start' : 'flex-end' }} >
                            <div id="message" className={'callEnded'} >
                                <span>{'users attended a live call'}</span>{" "}
                                <span>{moment(message.createdAt).fromNow(true)}</span>
                            </div>
                        </div>
                    )
                }

            })}
        </div>
    )


}

export default Messages

