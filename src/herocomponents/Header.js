import React, {useContext, useState} from 'react'
import './Header.css'
import discordlogo from './Discord-Logo-Color.png'
import { ProfileContext, LogoutContext } from '../App'
import Drawer from '@material-ui/core/Drawer';
import discordLogo from '../DiscordWhite.png'
import {NavigateHeroContext} from '../Hero'
import HomeIcon from '@material-ui/icons/Home';
import ForumIcon from '@material-ui/icons/Forum';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { indigo } from '@material-ui/core/colors'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Chatroombtn from './Chatroombtn'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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

    // navigate chatrooms
    const [viewNavigateChatroom, setViewNavigateChatroom] = useState(false)
    const openNavigateChatroom = () => {
        setViewNavigateChatroom(true)
    }
    const closeNavigateChatroom = () => {
        setViewNavigateChatroom(false)
    }

    return (
        <div className="header">
            <div className="headercontainer">
                <React.Fragment key='left'>
                    <label className="navigatedrawerbtn" onClick={openNavigateDrawer}>
                        <img src={discordlogo}/>
                    </label>
                    <Drawer
                        anchor='left'
                        open={viewNavigateDrawer}
                        onClose={closeNavigateDrawer}
                        BackdropProps={{style: {backgroundColor: 'transparent'}}}
                    >
                        <div className="navdrawerdiv">
                            <div className="navdrawerlogo">
                            <img className="discordlogo" src={discordLogo}/>
                            </div>
                            <label className="navdrawermenubtn" onClick={()=>{
                                navigateToHeroScreen('home');
                            }}>
                                <HomeIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Home.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                openNavigateChatroom();
                                closeNavigateDrawer();
                            }}>
                                <ForumIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Chatrooms.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                navigateToHeroScreen('profile');
                            }}>
                                <AccountBoxIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Profile.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={logout}>
                                <ExitToAppIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Logout.
                                </p>
                            </label>
                        </div>
                    </Drawer>
                </React.Fragment>
                <React.Fragment key='left'>
                    <Drawer
                        anchor='left'
                        open={viewNavigateChatroom}
                        onClose={closeNavigateChatroom}
                        BackdropProps={{style: {backgroundColor: 'transparent'}}}
                    >
                        <div className="navdrawerdiv">
                            <div className="navdrawerlogo">
                                <img className="discordlogo" src={discordLogo}/>
                            </div>
                            <label className="navdrawermenubtn" onClick={()=>{
                                closeNavigateChatroom();
                                openNavigateDrawer();
                            }}>
                                <ForumIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Chatrooms.
                                </p>
                            </label>
                            {profile.chatrooms!==undefined && profile.chatrooms.map(id=>(
                                <Chatroombtn chatroomId={id}/>
                            ))}
                            <label className="navdrawermenubtn" onClick={()=>{
                                closeNavigateChatroom();
                                openNavigateDrawer();
                            }}>
                                <ArrowBackIosIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Back.
                                </p>
                            </label>
                        </div>
                    </Drawer>

                </React.Fragment>
                <img src={profile.photoURL}/>
            </div>
        </div>
    )
}

export default Header
