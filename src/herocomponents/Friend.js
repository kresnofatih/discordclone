import React, {useContext, useState, useEffect} from 'react'
import './Friend.css'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { grey } from '@material-ui/core/colors'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {ProfileContext} from '../App'

function Friend({uid, displayName, photoURL, email, status, addToGroupEnabled}) {
    // to determine scopes: addfrien&d/chatfriend&/addtogroup
    const profile = useContext(ProfileContext)
    const [sample, setSample] = useState('nope')
    useEffect(()=>{
        try {
            if(profile.friends===undefined){
                throw "error";
            } else {
                console.log(profile.friends[0]);
                setSample(profile.friends[0]);
            }
        } catch(err) {
            console.log(err);
        }
    }, [profile])
    return (
        <div className="friend">
            <div className="friend_profile">
                <img src={photoURL}/>
                <div className="friend_profiledata">
                    <p className="friend_displayname">{sample}&nbsp;{displayName}</p>
                    <p className="friend_email">{email}</p>
                </div>
            </div>
            {true &&
                <div className="friend_buttons">
                    {/* on/offsign */}
                    {status==='online' ? (
                        <WbSunnyIcon style={{color: grey[50]}}/>
                    ):(
                        <NightsStayIcon style={{color: grey[50]}}/>
                    )}
                    &nbsp;&nbsp;

                    {/* chat the friend */}
                    <ChatBubbleIcon style={{fontSize: 25, color: grey[50]}}/>
                </div>
            }
            {addToGroupEnabled &&
                <div className="friend_buttons">
                    {/* add to group action */}
                    <GroupAddIcon style={{fontSize: 27, color: grey[50]}}/>
                </div>
            }
        </div>
    )
}

export default Friend