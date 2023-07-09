import React, { useState, useEffect, useContext } from "react"
import Logo from "../../img/logo_istic.jpg"
import "./LogoSearch.css"
import { UilSearch } from "@iconscout/react-unicons"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import { AppContext } from "../../Context"
import SearchResults from "../SearchResults/SearchResults"
import { domain } from "../../constants/constants"

const LogoSearch = () => {
  
  const { appInfo, setAppInfo } = useContext(AppContext)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  const searchUserByName = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${domain}/user/${search}/search?`,
      headers: {}
    }

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        setSearchResults(response.data.users)
      })
      .catch((error) => {
        alert(error);
      })
  }


  const profilePage = (user) => {
    appInfo.selectedPartner = user
    setAppInfo({ ...appInfo })
    navigate(`/profile/${user.id}`)
  }

  return (
    <div className="LogoSearch">
      <span style={{ marginBottom: '0px' }} />
      {/* 
      <div className="Logo-header">
         <Link to="../home">
          <img src={Logo} alt="" />
        </Link>
        <span>Social lstic</span>
      </div> */ }

      <span style={{ marginBottom: '0px' }} />


      <div className="Search-global">
        <div className="Search">
          <input
            type="text"
            name="search"
            value={search}
            id="search"
            placeholder="Istic Search ..."
            onChange={(e) => { setSearch(e.target.value); if (search.length >= 2) searchUserByName() }}
            onKeyUp={(e) => { if (e.key === 'Enter') searchUserByName() }}
          />


          <div className="s-icon">
            <UilSearch onClick={searchUserByName} />
          </div>

        </div>
      </div>


      {/* Render the search results */}
      
      {search.length >= 3 && <SearchResults results={searchResults} />}


    </div>
  )
}

export default LogoSearch;
