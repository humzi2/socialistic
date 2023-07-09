import React, { useState, useContext, useEffect } from "react"
import "./Auth.css"
import Logo from "../../img/logo_istic.png"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../../firebase/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { ToastContainer, toast, useToast } from 'react-toastify'
import axios from 'axios'
import { domain } from "../../constants/constants"
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from "../../Context"
import { webAuth } from "../../firebase/firebaseAuth"
import { Button } from 'react-bootstrap';
import {Row,Col} from "react-bootstrap"
const fireAuth = new webAuth()

const Auth = () => {

  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpass: "",
  };


  const navigate = useNavigate()

  const { appInfo, setAppInfo } = useContext(AppContext)
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialState);
  const [confirmPass, setConfirmPass] = useState(true);

  // const dispatch = useDispatch()




  // Reset Form
  const resetForm = () => {
    setData(initialState);
    setConfirmPass(confirmPass);
  }

  // handle Change in input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form Submission

  const schemes = async (user) => {

    let userData = JSON.stringify({
      "id": user.uid,
      "username": `${data.firstname} ${data.lastname}`,
      "email": user.email,
      "password": data.password
    })


    console.log(`/create user : user data : ${userData} `);

    let userConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/schemes/createuser?',
      headers: {
        'Content-Type': 'application/json'
      },
      data: userData
    }


    let conversationData = JSON.stringify({
      "me": {
        "id": user.uid,
        "name": user.displayName,
        "photo": user.photoURL
      },
      "partner": {
        "id": "Socialistic",
        "name": "Socialistic",
        "photo": "https://th.bing.com/th/id/R.8ecd3de4a4b57de791895330cf820509?rik=apELQREbj%2fT0oQ&riu=http%3a%2f%2fabdelzaher.cs.illinois.edu%2fimages%2fhead.png&ehk=woU2D0JqIZ5lRV4gZ9UAc69lYaKjywGalBytFcZMmyA%3d&risl=&pid=ImgRaw&r=0"
      }
    });

    let conversationConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/chat/onInteractionForChat?',
      headers: {
        'Content-Type': 'application/json'
      },
      data: conversationData
    };




    axios.request(userConfig)
      .then((response) => {
        console.log(JSON.stringify(`user created : ${response.data}`))
      })
      .catch((error) => {
        alert(error);
      })

    axios.request(conversationConfig)
      .then((response) => {
        console.log(`conversation created : ${JSON.stringify(response.data)}`);
      })
      .catch((error) => {
        alert(error);
      })
  }


  const getUserInfoFromMongoDb = (user) => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${domain}/user/${user.uid}`,
      headers: {}
    }

    // alert(`get : ${config.url}`)

    axios.request(config)
      .then((response) => {
        // alert(JSON.stringify(response.data))
        if (response.data.user) {
          appInfo.userInfo = response.data.user
          setAppInfo({ ...appInfo })
        }
      })
      .catch((error) => {
        alert(`user auth error : ${error}`)
      })
  }

  const emailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password)
      console.log(`result : ${result.user} `)
      toast.success('Login Successful', { position: "top-center" })
      // await fireAuth.setLoginSession(data.email, data.password)
      getUserInfoFromMongoDb(result.user)
      // navigate('/home')
    } catch (ex) {
      console.log(`error : ${ex.toString().split('Firebase:')[1]}`)
      toast.warn(ex.toString().split('Firebase:')[1], { position: "top-center" })
    }
  }



  const emailSignup = async () => {
    try {
      let result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      let user = result.user
      schemes(user)
      toast("register successfully", { position: "top-center" })
      resetForm()
    } catch (ex) {
      console.log(`error signing up : ${ex}`);
      toast(`error signing up : ${ex}`);

    }
  }

  const handleSubmit = async (e) => {
    setConfirmPass(true)
    e.preventDefault()
    if (isSignUp) {
      if (data.password === data.confirmpass) await emailSignup()
    } else {
      await emailLogin()
    }
  }

  return (
    
    <div className="Auth">
      {/* left side */}
      <Row>
         <Col>
         </Col>
         <Col></Col>
      </Row>
      <div className="a-left">
        <img src={Logo} alt="" />

        <div className="Webname">
          <h1>Social lstic</h1>
          <h6>Explore and share more knowledges <br></br>
            through experiences</h6>
        </div>
      </div>

      {/* right form side */}

     <div className="a-right">
    
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h3>{isSignUp ? "Register" : "Login"}</h3>
          {isSignUp && (
            <div>
            <input
              style={{ marginBottom: '20px' }}
              required
              type="text"
              placeholder="First Name"
              className="infoInput"
              name="firstname"
              value={data.firstname}
              onChange={handleChange}
            />
            <input
              style={{ marginBottom: '20px' }}
              required
              type="text"
              placeholder="Last Name"
              className="infoInput"
              name="lastname"
              value={data.lastname}
              onChange={handleChange}
            />
          </div>

          )}

          <div>
            <input
              style={{ marginBottom: '10px' }}
              required
              type="email"
              placeholder="email"
              className="infoInput"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>


          <div>
          
            <input
              required
              type="password"
              className="infoInput"
              placeholder="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            {isSignUp && (
              <input
                required
                type="password"
                className="infoInput"
                name="confirmpass"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            )}
          </div>

          <span
            style={{
              color: "red",
              fontSize: "12px",
              alignSelf: "flex-end",
              marginRight: "5px",
              display: confirmPass ? "none" : "block",
            }}
          >
            *Confirm password is not same
          </span>
          <div>
            <span
              style={{
                fontSize: "12px",
                cursor: "pointer",
                textDecoration: "underline",
                color: "green",
                marginBottom: '15px'
              }}
              onClick={() => {
                resetForm();
                setIsSignUp((prev) => !prev);
              }}
            >
              {isSignUp
                ? "Already have an account Login"
                : "Don't have an account Sign up"}
            </span>
            <button
              className="button infoButton"
              type="Submit"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Loading..." : isSignUp ? "SignUp" : "Login"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;
