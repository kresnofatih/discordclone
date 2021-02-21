import React, {useEffect, useState} from 'react'
import './Chatitem.css'
import fire from '../Fire'
import CircularProgress from '@material-ui/core/CircularProgress';
import { grey } from '@material-ui/core/colors'
import DescriptionIcon from '@material-ui/icons/Description';
import Drawer from '@material-ui/core/Drawer';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';

function Chatitem({uid, timestamp, msg}) {
    // get the user info
    const [userInfo, setUserInfo] = useState('')
    const [hasUserInfo, setHasUserInfo] = useState(false)
    const getUserInfo = async()=>{
        setHasUserInfo(false);
        const doc = await fire
                .firestore()
                .collection('users')
                .doc(uid)
                .get();
        if(doc.exists){
            setUserInfo(doc.data());
            setHasUserInfo(true);
        }
    };

    // identify type of chat content: msg/link/gif
    const [chatContentType, setChatContentType] = useState('')
    const identifyContent = (msg) => {
        if(msg.startsWith('discordclonegif:')){
            setChatContentType('gif');
        } else if(msg.startsWith('discordclonelink:')) {
            setChatContentType('link');
        } else {
            setChatContentType('msg');
        }
    }

    // view profile dialog
    const [viewProfileDrawer, setViewProfileDrawer] = useState(false)
    const openProfileDrawer = () => {
        setViewProfileDrawer(true)
    }
    const closeProfileDrawer = () => {
        setViewProfileDrawer(false)
    }

    useEffect(()=>{
        identifyContent(msg);
        getUserInfo();
    }, [uid, msg]);
    return (
        <div className="chatitem">
            <React.Fragment>
                {hasUserInfo &&
                <label className="clickablechatitemcomp" onClick={openProfileDrawer}>
                    <img className="chatitemuserphoto" src={userInfo.photoURL}/>
                </label>
                }
                {hasUserInfo &&
                    <div>
                        <label className="clickablechatitemcomp" onClick={openProfileDrawer}>
                        <p className="chatitem_displayname">{userInfo.displayName}
                            <p className="chatitem_timestamp">{timestamp}</p>
                        </p>
                        </label>
                        {chatContentType==='msg' &&
                            <p className="chatitem_chatmsg">
                                {msg}
                            </p>
                        }
                        {chatContentType==='link' &&
                            <div className="chatlinkdiv">
                                <DescriptionIcon style={{fontSize: 40, color: grey[50]}}/>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                <a 
                                    className="chatitem_chatlink" 
                                    href={msg.replace('discordclonelink:', '')}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {msg.replace('discordclonelink:', '')}
                                </a>
                            </div>
                        }
                        {chatContentType==='gif' &&
                            <img className="chatitemgif" src={msg.replace('discordclonegif:', '')}/>
                        }
                    </div>
                }
                {!hasUserInfo &&
                    <CircularProgress style={{fontSize: 25, color: grey[50]}}/>
                }
                <Drawer 
                    anchor='right' 
                    open={viewProfileDrawer} 
                    onClose={closeProfileDrawer}
                    BackdropProps={{style: {backgroundColor: 'transparent'}}}
                >
                    <div className="drawerdiv">
                        <img className="drawerfriendphoto" src={userInfo.photoURL}/>
                        <div className="profile_content_field">
                            <p className="profile_content_placeholder">DISPLAY NAME:</p>
                            <p className="profile_content_fieldvalue">{userInfo.displayName}</p>
                        </div>
                        <div className="profile_content_field">
                            <p className="profile_content_placeholder">UID:</p>
                            <p className="profile_content_fieldvalue">{userInfo.uid}</p>
                        </div>
                        <div className="profile_content_field">
                            <p className="profile_content_placeholder">EMAIL:</p>
                            <p className="profile_content_fieldvalue">{userInfo.email}</p>
                        </div>
                        <div className="profile_content_field">
                            <p className="profile_content_placeholder">STATUS:</p>
                            &nbsp;
                            {userInfo.status==='online' ? (
                                <label>
                                    <WbSunnyIcon style={{color: grey[50]}}/>
                                </label>
                            ):(
                                <label>
                                    <NightsStayIcon style={{color: grey[50]}}/>
                                </label>
                            )}
                        </div>
                    </div>
                </Drawer>
            </React.Fragment>
        </div>
    )
}

export default Chatitem
