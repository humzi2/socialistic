import * as React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { Image } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../Context'

export default function SearchResults({ results }) {

    const { appInfo, setAppInfo } = React.useContext(AppContext)
    const navigate = useNavigate()


    const showProfilePage = (user) => {
        // alert(`user : ${JSON.stringify(user)}`)
        appInfo.profileUser = user
        appInfo.selectedPartner = user
        appInfo.postsForPage = 'profile'
        setAppInfo({ ...appInfo })


        setTimeout(() => {
            navigate(`/profile/${user.id}`)
        }, 1000)

    }

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="main mailbox folders">
                <List>
                    {results.map((user) => {
                        return (
                            <ListItem style={{ backgroundColor: 'white' }} disablePadding onClick={() => { showProfilePage(user) }} >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Image style={{ width: '30px', height: '30px' }} src={user.profilePicture} />
                                    </ListItemIcon>
                                    <ListItemText primary={user.username} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>

            </nav>
            <Divider style={{ borderColor: '#222' }} />
        </Box>
    )
}


