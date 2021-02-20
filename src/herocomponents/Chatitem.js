import React, {useEffect, useState} from 'react'
import './Chatitem.css'
import fire from '../Fire'
import CircularProgress from '@material-ui/core/CircularProgress';
import { grey } from '@material-ui/core/colors'


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
            // console.log(userInfo);
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

    useEffect(()=>{
        identifyContent(msg);
        getUserInfo();
    }, [uid, msg]);
    return (
        <div className="chatitem">
            {hasUserInfo &&
                <img className="chatitemuserphoto" src={userInfo.photoURL}/>
            }
            {hasUserInfo &&
                <div>
                    <p className="chatitem_displayname">{userInfo.displayName}
                        <p className="chatitem_timestamp">{timestamp}</p>
                    </p>
                    {chatContentType==='msg' &&
                        <p className="chatitem_chatmsg">
                            {msg}
                        </p>
                    }
                    {chatContentType==='link' &&
                        <a className="chatitem_chatmsg" href={msg.replace('discordclonelink:', '')}>
                            {msg.replace('discordclonelink:', '')}
                        </a>
                    }
                    {chatContentType==='gif' &&
                        <img className="chatitemgif" src={msg.replace('discordclonegif:', '')}/>
                    }
                </div>
            }
            {!hasUserInfo &&
                <CircularProgress style={{fontSize: 25, color: grey[50]}}/>
            }
        </div>
    )
}

export default Chatitem
