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

        // friend requests
        if(doc.data().friendRequests===undefined){
            friendData.friendRequests = []; 
            // initializes friendRequest array, incase pushed later
        } else {
            friendData.friendRequests = doc.data().friendRequests; 
            // if friendRequests has existed
        }
        // pending friend requests
        if(doc.data().pendingFriendRequests===undefined){
            friendData.pendingFriendRequests = []; 
            // initializes pendingfriendRequest array, incase pushed later
        } else {
            friendData.pendingFriendRequests = doc.data().pendingFriendRequests; 
            // if pendingfriendRequests has existed
        }
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

    // to send request if nonfriend
    const sendFriendRequest = async () => {
        if(profile.pendingFriendRequests===undefined){
            profile.pendingFriendRequests = [];
        }
        profile.pendingFriendRequests.push(uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+profile.uid)
                .update({
                    pendingFriendRequests: profile.pendingFriendRequests
                });
        friendData.friendRequests.push(profile.uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+uid)
                .update({
                    friendRequests: friendData.friendRequests
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
                    <label onClick={sendFriendRequest}>
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
