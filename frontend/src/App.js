import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppContext } from './Context'
import { useEffect, useState } from 'react'
import { config } from './config'
import Home from './pages/Home'
import Auth from './pages/Auth/Auth'
import Profile from './pages/Profile/Profile'
import Chat from './pages/Chat/Chat'
import firebase from 'firebase/compat/app'
import { webAuth } from './firebase/firebaseAuth'
import axios from 'axios'
import GlobalSocketListener from './listener/globalSocketListener'
import Loading from './components/Loading/Loading'
import Live from './components/Live/Live'
import { ToastContainer } from 'react-toastify'
import { domain } from './constants/constants'
import 'firebase/compat/auth'
import 'react-toastify/dist/ReactToastify.css'
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'

const fireAuth = new webAuth()

function App() {
    
    const [appData, setAppData] = useState({
        userInfo: {},
        profileUser: {},
        chatHistory: [],
        selectedChatRoom: {},
        messages: [],
        online: true,
        chat: true,
        call: false,
        callType: 'recieving',
        buttonsClicked: false,
        listenToMongo: false,
        listening: false,
        liveNavGoBack: '/',
        chosenChat: false
    })

    const [loading, setLoading] = useState(true)

    if (!firebase.apps.length) firebase.initializeApp(config)

    const getUserInfoFromMongoDb = (user) => {



        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${domain}/user/${user.uid}`,
            headers: {}
        }


        axios.request(config)
            .then((response) => {
                // alert(JSON.stringify(response.data))
                if (response.data.user) {
                    setLoading(false)
                    appData.userInfo = response.data.user
                    setAppData({ ...appData })
                    // alert(`app data : userInfo : ${JSON.stringify(appData)}`)
                }
            })
            .catch((error) => {
                alert(`user auth error : ${error}`)
            })
    }


    const init = async () => {
        // get login session 
        const user = await fireAuth.getLoginSession()
        if (user.uid) getUserInfoFromMongoDb(user)
        if (!user.uid) setLoading(false)

    }

    const effect = () => {
        if (Object.keys(appData.userInfo).length <= 0) init()
    }

    useEffect(effect, [])


    return (
        <AppContext.Provider value={{ appInfo: appData, setAppInfo: setAppData }}>
            <ToastContainer />
            <BrowserRouter>
                <GlobalSocketListener />
                <Routes>

                    <Route
                        path="/"
                        element={loading ? <Loading /> : (appData.userInfo.id ? <Home /> : <Auth />)}
                    />


                    <Route
                        path="/home"
                        element={loading ? <Loading /> : (appData.userInfo.id ? <Home /> : <Auth />)}
                    />

                    <Route
                        path="/profile/:id"
                        element={loading ? <Loading /> : (appData.userInfo.id ? <Profile /> : <Auth />)}
                    />

                    <Route
                        path="/chat"
                        element={loading ? <Loading /> : (appData.userInfo.id ? <Chat /> : <Auth />)}
                    />

                    <Route
                        path="/chat/:id"
                        element={loading ? <Loading /> : (appData.userInfo.id ? <Chat /> : <Auth />)}
                    />


                    <Route
                        path="/live"
                        element={loading ? <Loading /> : (appData.userInfo.id ? <Live /> : <Auth />)}
                    />

                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    )
}

export default App



