import React from 'react'
import './Friend.css'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { grey } from '@material-ui/core/colors'

function Friend({displayName, photoURL, email, status}) {
    return (
        <div className="friend">
            <div className="friend_profile">
                <img src={photoURL}/>
                <div className="friend_profiledata">
                    <p className="friend_displayname">{displayName}</p>
                    <p className="friend_email">{email}</p>
                </div>
            </div>
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
        </div>
    )
}

export default Friend
