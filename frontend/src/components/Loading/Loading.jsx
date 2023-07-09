import React, { useState, useContext } from "react"
import { RotateCircleLoading } from 'react-loadingg'

const Loading = () => {
    return (
        <div style={Styles.center}  >
            <RotateCircleLoading style={{ marginBottom: '100px' }} />
        </div>
    )
}

export default Loading


const Styles = ({
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '105vh',
        backgroundColor: '#222'
    }
})





