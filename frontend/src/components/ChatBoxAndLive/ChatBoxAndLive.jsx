
import React, { useContext } from 'react'
import { AppContext } from '../../Context'

import Live from '../Live/Live'
import ChatBox from '../ChatBox/ChatBox'


function ChatBoxAndLive() {

    const { appInfo } = useContext(AppContext)

    if (!appInfo.call) {
        return <ChatBox />
    } else {
        return <Live />
    }
}

export default ChatBoxAndLive





