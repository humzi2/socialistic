import React, { useState, useRef, useContext } from "react"
import { UilScenery } from "@iconscout/react-unicons"
import { UilPlayCircle } from "@iconscout/react-unicons"
import { UilLocationPoint } from "@iconscout/react-unicons"
import { UilSchedule } from "@iconscout/react-unicons"
import { Col, Row, Toast } from 'react-bootstrap'
import { UilTimes } from "@iconscout/react-unicons"
import { AppContext } from "../../Context"
import AddAssets from "../AddAssets/AddAssets"
import axios from 'axios'
import { domain } from '../../constants/constants'
import { Storage } from '../../backend/storage/uploadFile'
import firebase from 'firebase/compat/app'
import { toast } from 'react-toastify'

import 'firebase/compat/auth'
import "./PostShare.css"
const storage = new Storage()

function PostShare(props) {

    var user = firebase.auth().currentUser

    const { appInfo, setAppInfo } = useContext(AppContext)

    const [loading, setLoading] = useState(false)
    const [text, setText] = useState()
    //const [location, setLocation] = useState()
    //const [date,setDate] = useState()
    const [DateIcon, setDateIcon] = useState(false)
    const [showAddAssets, setShowAddAssets] = useState(true)

    const [postInfo, setPostInfo] = useState({
        userId: appInfo.userInfo.id,
        username: appInfo.userInfo.username,
        profilePicture: appInfo.userInfo.profilePicture,
        text: text,
        imageLinks: [],
        videoLinks: [],
        images: [],
        videos: [],
        locations: [],
        dates: [],
        likes: [],
        comments: []
    })

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                postInfo.locations.push({ latitude, longitude })
                setPostInfo({ ...postInfo })
            },
            (error) => {
                console.error(error);
            }
        )
    }

    // handle Image Change
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0]
            postInfo.imageLinks.push(URL.createObjectURL(img))
            postInfo.images.push(img)
            setPostInfo({ ...postInfo })
        }
    }


    // handle Video Change
    const onVideoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let vid = event.target.files[0]
            postInfo.videoLinks.push(URL.createObjectURL(vid))
            postInfo.videos.push(vid)
            setPostInfo({ ...postInfo })
        }
    }


    // handle Date Change
    const onBlur = (e) => {
        const selectedDate = e.target.value
        postInfo.dates.push(selectedDate);
    }

    const ChangeDateIcon = () => {
        setDateIcon(!DateIcon)
    }


    const reset = () => {
        setShowAddAssets(false)
        setText('')
        postInfo.imageLinks = []
        postInfo.videoLinks = []
        postInfo.videos = []
        postInfo.images = []
        postInfo.locations = []
        postInfo.dates = []
        postInfo.likes = []
        postInfo.comments = []
        setPostInfo(postInfo)
    }

    const uploadImagesToFirebase = async (postId) => {

        const imagePromises = postInfo.images.map(async (image, index) => {
            const result = await storage.uploadImage(`posts/${postId}/images/image_${index}`, 'image/jpeg', image)
            return result.downloadLink
        })


        const videoPromises = postInfo.videos.map(async (video, index) => {
            const result = await storage.uploadImage(`posts/${postId}/videos/video_${index}`, 'video/mp4', video)
            return result.downloadLink
        })

        const picLinks = await Promise.all(imagePromises)
        const videoLinks = await Promise.all(videoPromises)

        postInfo.images = picLinks
        postInfo.videos = videoLinks

        setPostInfo(postInfo)
    }

    function getRandomArbitrary(min, max) {
        return Math.trunc(Math.random() * (max - min) + min)
    }


    const handleUpload = async () => {
        setLoading(true)
        const postId = getRandomArbitrary(1, 1000000000)
        await uploadImagesToFirebase(postId)

        postInfo.text = text
        setPostInfo({ ...postInfo })

        let data = JSON.stringify(postInfo)

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${domain}/posts/create`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                setLoading(false)
                reset()
                toast.success('Post uploaded successfully', { position: 'bottom-center' })
            })
            .catch((error) => {
                console.log(error)
                alert(error)
            })

    }

    const imageRef = useRef();
    const videoRef = useRef();


    return (
        <Row className="PostShare">

            <img style={{ width: '57px', height: '37px' }} src={appInfo.userInfo.profilePicture} alt="Profile" />


            <div style={{ width: '85%' }} >
                <input
                    type="text"
                    placeholder="What's happening ?"
                    onChange={(e) => { setText(e.target.value) }}
                    required
                />

                <AddAssets postInfo={postInfo} setPostInfo={setPostInfo} />


                <div className="option" style={{ color: "var(--shedule)" }}>
                    {DateIcon &&
                        <input type="Date" onBlur={onBlur}
                            style={{ marginRight: 4, border: '0', color: "var(--shedule)", marginLeft: 5, fontSize: '13px' }} />}
                </div>


                <div className="postOptions">
                    <div
                        className="option"
                        style={{ color: "var(--photo)" }}
                        onClick={() => imageRef.current.click()}
                    >
                        <UilScenery />
                        Photo
                    </div>

                    <div
                        className="option"
                        style={{ color: "var(--video)" }}
                        onClick={() => videoRef.current.click()}
                    >
                        <UilPlayCircle />
                        Video
                    </div>

                    <div
                        className="option"
                        style={{ color: "var(--location)" }}
                        onClick={getLocation}
                    >
                        <UilLocationPoint />
                        Location
                    </div>
                    <div className="option" style={{ color: "var(--shedule)" }}
                        onClick={ChangeDateIcon}>
                        <UilSchedule />
                        Shedule
                    </div>
                    <button
                        className="button ps-button"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "uploading" : "Share"}
                    </button>



                    <div style={{ display: "none" }}>
                        <input type="file" ref={imageRef} onChange={onImageChange} />
                    </div>
                    <div style={{ display: "none" }}>
                        <input type="file" ref={videoRef} onChange={onVideoChange} />
                    </div>
                </div>


            </div>



        </Row>
    )
}

export default PostShare



