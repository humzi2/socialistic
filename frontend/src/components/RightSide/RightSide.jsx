import React, { useState } from "react"
import TrendCard from "../TrendCard/TrendCard"
import ShareModal from "../ShareModal/ShareModal"
import NavIcons from "../NavIcons/NavIcons"
import "./RightSide.css"

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div className="RightSide">

     {/* <NavIcons /> */}

     
      <TrendCard />

      {/* <button className="button r-button" onClick={() => setModalOpened(true)}>
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} /> */}

      
    </div>
  )
}

export default RightSide
