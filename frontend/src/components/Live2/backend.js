import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { addMessage } from '../../api/MessageRequests';

export const main = (notify, appInfo, setAppInfo, navigate) => {

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBhKtn4TK7LY4cG6zOZ8RPWBx12IDrxAhc",
    authDomain: "my-first-project-ce24e.firebaseapp.com",
    databaseURL: "https://my-first-project-ce24e.firebaseio.com",
    projectId: "my-first-project-ce24e",
    storageBucket: "my-first-project-ce24e.appspot.com",
    messagingSenderId: "627497957398",
    appId: "1:627497957398:web:8049cba44bd6c2ee49dd37"
  }

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  const firestore = firebase.firestore();


  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  }


  const pc = new RTCPeerConnection(servers);
  let localStream = null;
  let remoteStream = null;


  // start webcam button 
  const webcamButton = document.getElementById('webcamButton')

  // video player 1
  const webcamVideo = document.getElementById('webcamVideo')

  // create call (offer) button
  const callButton = document.getElementById('callButton')

  // livestream id to share with other users
  const callInput = document.getElementById('callInput')

  // answer button
  const answerButton = document.getElementById('answerButton')

  // 2nd video player
  const remoteVideo = document.getElementById('remoteVideo')

  // hangup btn
  const hangupButton = document.getElementById('hangupButton')



  // start webcam button click
  webcamButton.onclick = async () => {

    try {

      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      remoteStream = new MediaStream()

      // Push tracks from local stream to peer connection
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      })


      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      webcamVideo.srcObject = localStream;
      remoteVideo.srcObject = remoteStream;

      // callButton.disabled = false;
      // answerButton.disabled = false;
      // webcamButton.disabled = true;

    } catch (ex) {
      console.log(`error: ${ex}`)
    }
  }


  hangupButton.onclick = async () => {
    // alert(`hangup button clicked`)
    if (localStream) {
      // Stop local tracks
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }

    if (remoteStream) {
      // Stop remote tracks
      remoteStream.getTracks().forEach(track => track.stop());
      remoteStream = null;
    }

    // Reset video element
    webcamVideo.srcObject = null
    remoteVideo.srcObject = null

    appInfo.call = false
    appInfo.chosenChat = false

    // send abort message/event

    console.log(`aborted by partner : ${appInfo.abortedByPartner}`)
    if (!appInfo.abortedByPartner) {
      let message = { chatRoomKey: appInfo.selectedChatRoom.key, messageId: Math.random().toString(), myId: appInfo.userInfo.id, partnerId: appInfo.selectedChatRoom.partner.id, text: '${{end call}}', liveStreamingKey: appInfo.liveStreamingKey, abort: true }
      console.log(`aborted by me : abort message : ${JSON.stringify(message)}`)
      await addMessage(message)
    }

    setAppInfo({ ...appInfo })
    navigate(appInfo.liveNavGoBack)

  }


  // 2. Create an offer Button clicked
  callButton.onclick = async () => {
    // Reference Firestore collections for signaling
    // alert('create offer')
    const callDoc = firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    callInput.value = callDoc.id;

    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    // hangupButton.disabled = false
    notify(callDoc.id)

  };

  // 3. Answer the call with the unique ID
  answerButton.onclick = async () => {
    // alert(`answer : ${callInput.value}`)

    const callId = callInput.value;
    const callDoc = firestore.collection('calls').doc(callId);
    const answerCandidates = callDoc.collection('answerCandidates');
    const offerCandidates = callDoc.collection('offerCandidates');

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change);
        if (change.type === 'added') {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

}
