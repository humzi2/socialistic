import React from "react"
import FollowersCard from '../FollowersCard/FollowersCard'
import LogoSearch from '../LogoSearch/LogoSearch'
import ProfileCardUser from '../ProfileCardUser/ProfileCardUser'
import './ProfileSide.css'
import ProfileCard from "../ProfileCard/ProfileCard"
import ProfileCardHomePage from "../ProfileCardHomePage/ProfileCardHomePage"

const ProfileSide = () => {

  return (
    <div className="ProfileSide">
      <LogoSearch />
      <ProfileCardHomePage />
      <FollowersCard />
    </div>
  )
}

export default ProfileSide