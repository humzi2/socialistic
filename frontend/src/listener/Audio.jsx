import React, { useState, useEffect } from "react"
// import ringer from './ringer.mp3'

const Audio = ({ data }) => {
    return (
        <div>
            <iframe
                style={{ display: 'none' }}
                width="200"
                height="200"
                src="https://www.youtube.com/embed/amz9FN0x49w?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            >
            </iframe>
        </div>
    )
}

export default Audio


