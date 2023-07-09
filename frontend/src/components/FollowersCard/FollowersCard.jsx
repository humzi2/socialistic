import React, { useContext, useEffect, useState } from "react";
import FollowersModal from "../FollowersModal/FollowersModal";
import { getAllUser } from "../../api/UserRequests";
import User from "../User/User";
import { useNavigate } from "react-router-dom";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import "./FollowersCard.css";
import { AppContext } from "../../Context";

// Importez votre image par défaut
//import defaultProfileImage from "../../path/to/defaultProfileImage.jpg";

const FollowersCard = ({ location }) => {

  const { appInfo, setAppInfo } = useContext(AppContext)
  const [modalOpened, setModalOpened] = useState(false)
  const [persons, setPersons] = useState([])
  const [displayCount, setDisplayCount] = useState(8)

  var user = firebase.auth().currentUser
  user.following = []

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const navigate = useNavigate();

  const handleProfileClick = (followerId) => {
    navigate(`/profile/${followerId}`);
  };

  useEffect(() => {
    const fetchPersons = async () => {

      const { data } = await getAllUser(displayCount, [
        //...user.following,
        user.id,
      ]);
      const filteredPersons = data.filter((person) => person.id !== appInfo.userInfo.id)
      setPersons(filteredPersons);
    };
    if (!persons.length) fetchPersons();
  }, [user.following, appInfo.userInfo.id, displayCount])


  const handleSeeMore = () => {
    setDisplayCount(persons.length)
  }


  return (
    <div className="FollowersCard">

      <h3>Suggestions</h3>

      {persons.map((person) => (
        <div
          key={person._id}
          style={{ cursor: "pointer" }}
        >
          {location === "profilePage" ? (
            ""
          ) : (
            <User
              person={person}
              profileImage={person.profilePicture || serverPublic + "defaultProfile.png"}
            />
          )}
        </div>
      ))}

      {displayCount < persons.length && !location && (
        <span onClick={handleSeeMore}>See more</span>
      )}

      <FollowersModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        persons={persons}
      />
    </div>
  );
};

export default FollowersCard