import React, { useContext, useEffect, useState } from "react"
import { getTimelinePosts } from "../../actions/PostsAction"
import Post from "../Post/Post"
import { useSelector, useDispatch } from "react-redux"
import "./Posts.css"
import { useParams } from "react-router-dom"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import axios from 'axios'
import { AppContext } from "../../Context"
import { domain } from "../../constants/constants"

const Posts = () => {

  const params = useParams();
  const user = firebase.auth().currentUser

  const [posts, setPosts] = useState([])
  const [myPosts, setMyPosts] = useState([])

  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)

  const { appInfo, setAppInfo } = useContext(AppContext)



  const replacePic = (list) => {
    list.forEach((item) => {
      if (item.userId === appInfo.userInfo.id) {
        item.profilePicture = appInfo.userInfo.profilePicture
      }
    })
    return list
  }


  const getPostsByFollowedUsers = async () => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${domain}/posts/timeline?id=${appInfo.userInfo.id}`,
      headers: {}
    }

    try {

      const response = await axios.request(config)
      let list = response.data.posts
      list = replacePic(list)
      setPosts([...list])

      appInfo.postsByFollowedCount = list.length // by users i follow
      setAppInfo({ ...appInfo })

    } catch (ex) {
      console.log(`error : ${ex}`);
    }

  }


  const getMyPosts = async () => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${domain}/posts/myposts?id=${appInfo.userInfo.id}`,
      headers: {}
    }


    try {
      const response = await axios.request(config)
      let list = response.data.posts
      list = replacePic(list)
      console.log(`my posts :: ${JSON.stringify(list)}`)
      setMyPosts([...list])
      appInfo.myPostsCount = list.length
      setAppInfo({ ...appInfo })
    } catch (ex) {
      console.log(`error : ${ex}`);
    }


  }




  const init = async () => {
    setLoading(true)
    await getPostsByFollowedUsers()
    await getMyPosts()
    setLoading(false)
    setComplete(true)
  }



  const effect = () => {
    init()
  }


  useEffect(effect, [])


  return (
    <div className="Posts">


      {loading ? (
                "              Fetching posts...."
      ) : (
        myPosts.map((post, id) => {
          return <Post data={post} key={id} posts={myPosts} setPosts={setMyPosts} />
          // return null
        })
      )}


      {loading ? (
        ""
      ) : (
        posts.map((post, id) => {
          return <Post data={post} key={id} posts={posts} setPosts={setPosts} />
          // return null
        })
      )}





      {!posts.length && complete &&
        <p style={{ marginLeft: '30%', font: 'italic 18px times new roman' }} > No posts from people you follow to show </p>
      }

    </div>
  )
}

export default Posts