import React, { useContext, useMemo, useState } from 'react'
import { Col } from 'react-bootstrap'
import { AppContext } from '../../Context'
import { UilTimes } from "@iconscout/react-unicons"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function AddAssets({ postInfo, setPostInfo }) {
    const { appInfo, setAppInfo } = useContext(AppContext)
    const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY })
    const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [video, setVideo] = useState(null)
    const [location, setLocation] = useState(null)
    const [calendar, setCalendar] = useState(null)


    const removeAsset = (assetType, assetIndex) => {
        postInfo[assetType].splice(assetIndex, 1)
        setPostInfo({ ...postInfo })
    }

    const onBlur = (e) => {
        const selectedDate = e.target.value
        postInfo.dates.push(selectedDate)
    }


    return (
        <div style={Styles.flexView}>

            {postInfo.text &&
                <p style={{ font: '14px times new roman' }} >  {postInfo.text}  </p>
            }

            {postInfo.imageLinks.map((imageLink, index) => {
                return (
                    <div key={Math.random()} style={Styles.asset} className="previewImage">
                        <UilTimes onClick={() => { removeAsset('images', index) }} />
                        <img src={imageLink} alt="preview" />
                    </div>
                )
            })}

            {postInfo.videoLinks.map((videoLink, index) => {
                return (
                    <div key={Math.random()} style={{ width: '100px', height: '100px', ...Styles.asset }} className='previewImage' >
                        <UilTimes onClick={() => { removeAsset('videos', index) }} />
                        <video controls style={{ width: '100%', height: '100px' }} >
                            <source src={videoLink} alt="preview" />
                        </video>
                    </div>
                )
            })}



            {postInfo.locations.map((location) => {
                return (
                    <div key={Math.random()} style={{ width: '100%', height: 'auto' }} >
                        {isLoaded &&
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '500px' }}
                                center={{ lat: location.latitude, lng: location.longitude }}
                                zoom={10}
                            />
                        }
                    </div>
                )
            })}


    
        </div>
    )
}

export default AddAssets



const Styles = ({
    flexView: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    asset: {
        margin: '1px'
    }
})
