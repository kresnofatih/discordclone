import React, {useContext, useState} from 'react'
import './Header.css'
import discordlogo from './Discord-Logo-Color.png'
import { ProfileContext, LogoutContext } from '../App'
import Drawer from '@material-ui/core/Drawer';
import discordLogo from '../DiscordWhite.png'
import {NavigateHeroContext} from '../Hero'

function Header() {
    const profile = useContext(ProfileContext);
    const logout = useContext(LogoutContext);

    // navigate
    const [viewNavigateDrawer, setViewNavigateDrawer] = useState(false)
    const openNavigateDrawer = () => {
        setViewNavigateDrawer(true);
    }
    const closeNavigateDrawer = () => {
        setViewNavigateDrawer(false);
    }
    // navigate to other pages
    const navigateToHeroScreen = useContext(NavigateHeroContext);

    return (
        <div className="header">
            <div className="headercontainer">
                <React.Fragment key='left'>
                    <label onClick={openNavigateDrawer}>
                        <img src={discordlogo}/>
                    </label>
                    <Drawer
                        anchor='left'
                        open={viewNavigateDrawer}
                        onClose={closeNavigateDrawer}
                        BackdropProps={{style: {backgroundColor: 'transparent'}}}
                    >
                        <div className="navdrawerdiv">
                            <img className="discordlogo" src={discordLogo}/>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <label className="navdrawermenubtn" onClick={()=>{
                                navigateToHeroScreen('home');
                                closeNavigateDrawer();
                            }}>
                                Home.
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                closeNavigateDrawer();
                            }}>
                                Chatrooms.
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                navigateToHeroScreen('profile');
                                closeNavigateDrawer();
                            }}>
                                Profile.
                            </label>
                        </div>
                    </Drawer>
                </React.Fragment>
                <img src={profile.photoURL} onClick={logout}/>
            </div>
        </div>
    )
}

export default Header
