import React, {useContext} from 'react'
import './Header.css'
import discordlogo from './Discord-Logo-Color.png'
import { ProfileContext, LogoutContext } from '../App'

function Header() {
    const profile = useContext(ProfileContext);
    const logout = useContext(LogoutContext);

    
    return (
        <div className="header">
            <div className="headercontainer">
                <img src={discordlogo}/>
                <img src={profile.photoURL} onClick={logout}/>
            </div>
        </div>
    )
}

export default Header
