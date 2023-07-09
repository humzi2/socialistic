import React, { useEffect, useState } from "react";
import "./FollowingsCard.css";
import FollowingsModal from "../FollowingsModal/FollowingsModal";
import User from "../User/User";
import { useNavigate } from "react-router-dom";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const FollowingsCard = ({ location }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [followings, setFollowings] = useState([]);
  var user = firebase.auth().currentUser

  const navigate = useNavigate();

  const handleProfileClick = (followingId) => {
    navigate(`/profile/${followingId}`);
  }

  useEffect(() => {
    setFollowings(user.following);
  }, [user.following]);

  return (
    <div className="FollowingsCard">
      <h3>Suggestions</h3>

      {followings.map((following) => (
        <div
          key={following._id}
          onClick={() => handleProfileClick(following._id)}
          style={{ cursor: "pointer" }}
        >
          {location === "profilePage" ? (
            ""
          ) : (
            <User person={following} />
          )}
        </div>
      ))}

      <FollowingsModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        followings={followings}
      />
    </div>
  );
};

export default FollowingsCard;
