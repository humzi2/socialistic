import React from 'react';
import { useState } from "react";
import "./LogoSearchResults.css";


export const LogoSearchResults = ({results}) => {
  const [searchResults] = useState([]);

  return (
    <div className='LogoSearch-results' searchResults={searchResults}>
    searchresult
       {/*
        results.map((result, id) => {
            return <div key={id}> {result.name} </div>
        })*/
       }
    </div>
  )
}

export default LogoSearchResults;


