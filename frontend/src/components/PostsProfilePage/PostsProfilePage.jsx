import React, { useContext, useEffect, useState } from "react"
import { getTimelinePosts } from "../../actions/PostsAction"
import Post from "../Post/Post"
import { useSelector, useDispatch } from "react-redux"
import "./Posts.css"
import { useParams } from "react-router-dom"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context"
import Loading from "../Loading/Loading"
import { domain } from "../../constants/constants"
import axios from 'axios'

const PostsProfilePage = () => {

  const params = useParams()
  const user = firebase.auth().currentUser

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)

  const { appInfo, setAppInfo } = useContext(AppContext)


  const getMyPosts = () => {


    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${domain}/posts/myposts?id=${appInfo.profileUser.id}`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        let list = response.data.posts
        // alert(`timeline posts :: ${JSON.stringify(list)}`)
        setPosts([...list])
        setLoading(false)
        setComplete(true)

        appInfo.myPostsCount = list.length
        setAppInfo({ ...appInfo })

      })
      .catch((error) => {
        console.log(error)
      })

  }



  const init = () => {
    setLoading(true)
    getMyPosts()
  }

  const effect = () => {
    if (!complete && appInfo.profileUser.id) init()

  }


  useEffect(effect, [])

  if (appInfo.profileUser.id) {
    return (
      <div className="Posts">
        {loading ? ("Fetching posts....")
          : (
            posts.map((post, id) => {
              return <Post data={post} key={id} posts={posts} setPosts={setPosts} />;
            })
          )}

        {!posts.length && complete && <span style={{ marginLeft: '38%' }} > You have not posted anything so far  </span>}

      </div>
    )
  } else {
    return <Loading />
  }

}

export default PostsProfilePage;


