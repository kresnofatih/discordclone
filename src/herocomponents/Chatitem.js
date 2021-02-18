import React, {useEffect, useState} from 'react'
import './Chatitem.css'
import fire from '../Fire'

function Chatitem({uid, timestamp, msg}) {
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

    useEffect(()=>{
        getUserInfo();
    }, [uid]);
    return (
        <div className="chatitem">
            {hasUserInfo &&
                <img src={userInfo.photoURL}/>
            }
            <div>
                {hasUserInfo &&
                    <p className="chatitem_displayname">{userInfo.displayName}
                        <p className="chatitem_timestamp">{timestamp}</p>
                    </p>
                }
                <p className="chatitem_chatmsg">
                    {msg}
                </p>
            </div>
        </div>
    )
}

export default Chatitem
