import React, { useState } from "react";
import "./ProfileCard.css";
import FollowingModal from "../FollowingModal/FollowingModal";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const ProfileCard = ({ location }) => {
  // ...

  const [followingModalOpened, setFollowingModalOpened] = useState(false);
  var user = firebase.auth().currentUser  

  return (
    <div className="ProfileCard">
      {/* ... */}
      <div className="followStatus">
        <hr />
        <div>
          {/* ... */}
          <div className="follow">
            {/* ... */}
            <span onClick={() => setFollowingModalOpened(true)} style={{ cursor: "pointer" }}>
              Following
            </span>
            <FollowingModal
              modalOpened={followingModalOpened}
              setModalOpened={setFollowingModalOpened}
              following={user.following} // Passer les données des personnes que vous suivez
            />
          </div>
          {/* ... */}
        </div>
        <hr />
      </div>
      {/* ... */}
    </div>
  );
};

export default ProfileCard;
