import { useContext, useEffect, useState } from 'react'
import { main } from './backend'
import { addMessage, getMessages } from "../../api/MessageRequests"
import { AppContext } from '../../Context'
import { useNavigate } from 'react-router-dom'
import { io } from "socket.io-client"
import { domain } from '../../constants/constants'
import { RotateCircleLoading } from 'react-loadingg'
const ENDPOINT = domain
const socket = io(ENDPOINT)


function Live() {

    const { appInfo, setAppInfo } = useContext(AppContext)
    const [answerClicked, setAnswerClicked] = useState(false)
    const navigate = useNavigate()


    const socketListener = () => {
        socket.on('message', (data) => {
            let message = data.fullDocument
            if (message && message.text === '${{end call}}') {
                console.log(`abort message tracked in Live.jsx: ${message.text}, full :  ${JSON.stringify(message)}`)
                // alert(`abort message tracked in Live.jsx: ${message.text}, full :  ${JSON.stringify(message)}`)

                appInfo.abortedByPartner = true
                setAppInfo({ ...appInfo })

                var x = setInterval(() => {
                    let hangup = document.getElementById('hangupButton')
                    if (hangup) clearInterval(x)
                    if (hangup) hangup.click()
                }, 500)
            }

        })
    }

    const notify = async (streamKey) => {

        const message = {
            chatRoomKey: appInfo.selectedChatRoom.key,
            messageId: Math.random().toString(),
            myId: appInfo.userInfo.id,
            partnerId: appInfo.selectedChatRoom.partner.id,
            text: 'call Request',
            liveStreamingKey: streamKey
        }

        try {
            await addMessage(message)
        }
        catch (ex) {
            console.log(`error : ${ex}`)
        }

    }

    const automateSendCall = () => {
        if (!appInfo.buttonsClicked) {
            appInfo.buttonsClicked = true
            setTimeout(() => {
                setAppInfo({ ...appInfo })
                document.getElementById('webcamButton').click()
            }, 2000)

            setTimeout(() => {
                if (appInfo.callType === 'sending') {
                    var callBtn = document.getElementById('callButton')
                    callBtn.click()
                }
            }, 5000)
        }

    }


    const automateRecieveCall = () => {
        setTimeout(() => {
            setAppInfo({ ...appInfo })
            console.log(`click cam button`)
            document.getElementById('webcamButton').click()
        }, 2000)

        setTimeout(() => {
            console.log(`click call input button`)
            document.getElementById('callInput').value = appInfo.liveStreamingKey
        }, 5000)

        setTimeout(() => {
            console.log(`click call answer button`)
            setAnswerClicked(true)
            
            document.getElementById('answerButton').click()
        }, 8000)

    }

    const effect = () => {

        socketListener()

        main(notify, appInfo, setAppInfo, navigate)
        if (appInfo.callType === 'sending') automateSendCall()
        if (appInfo.callType === 'recieving') automateRecieveCall()
    }

    useEffect(effect, [])

    return (
        <div style={Styles.container}>

            {/* <div style={{ font: "bold 18px roboto" }}> Start your Webcam</div> */}

            <br />


            <video style={Styles.video} id="webcamVideo" controls width={'900px'} height={'500px'} autoPlay playsInline></video>
            <video style={Styles.video} id="remoteVideo" controls width={'900px'} height={'500px'} autoPlay playsInline></video>
            {/* {!answerClicked &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70%' }} >
                    <h6> Loading </h6>
                    <RotateCircleLoading />
                </div>
            } */}

            <button style={Styles.Button} id="webcamButton">Start webcam</button>
            <br />
            <br />
            <br />

            <button style={Styles.Button} id="callButton">Create Call (offer)</button>


            {/* <div style={{ font: "18px roboto" }}>
                OR
            </div>

            <h6>Join a Call</h6> */}



            <input style={{ display: 'block' }} id="callInput" placeholder='livestream id' />
            <br />
            <br />

            <button style={Styles.Button} id="answerButton" >Answer</button>



            <br />
            <br />

            <button style={Styles.abortButton} id="hangupButton" >Hangup</button>


        </div >
    );
}

export default Live

const Styles = ({
    container: {
        backgroundColor: '#222',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Button: {
        font: "14px roboto",
        width: '140px',
        height: '50px',
        backgroundColor: '#2c3e50',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        // display: 'none'
    },
    abortButton: {
        font: "14px roboto",
        width: '140px',
        height: '50px',
        backgroundColor: '#2c3e50',
        border: 'none',
        color: 'white',
        cursor: 'pointer'
    },
    bigText: {
        font: "14px roboto"
    },
    smallText: {
        font: "18px roboto"
    },
    video: {
        width: '900px',
        height: '500px',
        marginBottom: '5px',
        border: 'solid 1px',
        backgroundColor: 'rgb(50,50,50)'
    }
})