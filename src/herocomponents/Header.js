import React, {useContext} from 'react'
import './Header.css'
import discordwordmark from './DiscordWordmarkWhite.png'
import { ProfileContext, LogoutContext } from '../App'

function Header() {
    const profile = useContext(ProfileContext)
    const logout = useContext(LogoutContext)
    return (
        <div className="header">
            <div className="headercontainer">
                <img src={discordwordmark}/>
                <img src={profile.photoURL} onClick={logout}/>
            </div>
        </div>
    )
}

export default Header
