import React, {useContext, useState, useEffect} from 'react'
import './Friend.css'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { grey } from '@material-ui/core/colors'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {ProfileContext} from '../App'
import fire from '../Fire'

function Friend({uid, addToGroupEnabled}) {
    // get friend data from uid
    const [friendData] = useState({})
    const [hasFriendData, setHasFriendData] = useState(false);
    const getFriendData = async () => {
        setHasFriendData(false);
        const doc = await fire
                            .firestore()
                            .collection('users')
                            .doc(uid)
                            .get();
        friendData.displayName = doc.data().displayName;
        friendData.photoURL = doc.data().photoURL;
        friendData.email = doc.data().email;
        friendData.status = doc.data().status;
        setHasFriendData(true);
    }

    // to determine scopes: addfrien&d/chatfriend&/addtogroup
    const profile = useContext(ProfileContext)
    const [friendMode, setFriendMode] = useState('nonfriend')
    const getFriendMode = () => {
        try {
            if(profile.friends===undefined){
                throw "error: cannot find profile.friends";
            } else {
                if(profile.friends.includes(uid)){
                    setFriendMode('friend');
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    // to add friend if not friend before
    const addUserAsFriend = async () => {
        profile.friends.push(uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+profile.uid)
                .update({
                    friends: profile.friends
                });
    }

    // functions being run on refresh
    useEffect(()=>{
        getFriendData();
        getFriendMode();
    }, [profile])
    return (
        <div className="friend">
            {hasFriendData &&
                <div className="friend_profile">
                    <img src={friendData.photoURL}/>
                    <div className="friend_profiledata">
                        <p className="friend_displayname">{friendData.displayName}</p>
                        <p className="friend_email">{friendData.email}</p>
                    </div>
                </div>
            }
            {friendMode==='friend' &&
                <div className="friend_buttons">
                    {/* on/offsign */}
                    {hasFriendData && friendData.status==='online' ? (
                        <WbSunnyIcon style={{color: grey[50]}}/>
                    ):(
                        <NightsStayIcon style={{color: grey[50]}}/>
                    )}
                    &nbsp;&nbsp;

                    {/* chat the friend */}
                    <ChatBubbleIcon style={{fontSize: 25, color: grey[50]}}/>
                </div>
            }
            {friendMode==='nonfriend' &&
                <div className="friend_buttons">
                    {/* add friend */}
                    <label onClick={addUserAsFriend}>
                        <PersonAddIcon style={{fontSize: 25, color: grey[50]}}/>
                    </label>
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
