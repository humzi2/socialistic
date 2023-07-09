import { useContext, useEffect } from "react"
import { AppContext } from "../Context"
import { io } from "socket.io-client"
import { domain } from "../constants/constants"
const ENDPOINT = domain
const socket = io(ENDPOINT);

const SocketHandler = () => {
    const { appInfo, setAppInfo } = useContext(AppContext)

    useEffect(() => {
    
        socket.emit("new-user-add", appInfo.userInfo.id)

        socket.on("get-users", (users) => {
            // alert(users)
            // setOnlineUsers(users)
        })


    }, [])

    return null
}

export default SocketHandler
