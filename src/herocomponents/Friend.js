import React, {useContext, useState, useEffect} from 'react'
import './Friend.css'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { grey, lightGreen, red } from '@material-ui/core/colors'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {ProfileContext} from '../App'
import fire from '../Fire'
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import firebase from 'firebase'
import {NavigateChatroomContext, NavigateHeroContext} from '../Hero'


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
        friendData.friends = doc.data().friends;
        friendData.chatrooms = doc.data().chatrooms;

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

    // to determine mode: nonfriend/pending/requested/friend
    const profile = useContext(ProfileContext)
    const [friendMode, setFriendMode] = useState('nonfriend')
    const getFriendMode = () => {
        try {
            if(profile.friends===undefined){
                throw "error: cannot find profile.friends";
            } else {
                if(profile.friends.includes(uid)){
                    setFriendMode('friend');
                } else if(profile.pendingFriendRequests.includes(uid)){
                    setFriendMode('pending');
                } else if(profile.friendRequests.includes(uid)){
                    setFriendMode('requested');
                }
                if(addToGroupEnabled){
                    setFriendMode('addToGroup');
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    // initialize friendRequest & pendingFriendRequest
    const initializeFriendRequestContext = () => {
        try {
            if(profile.friends===undefined){
                throw "error: cannot find profile.friends";
            } else {
                if(profile.friendRequests===undefined){
                    profile.friendRequests=[];
                };
                if(profile.pendingFriendRequests===undefined){
                    profile.pendingFriendRequests=[];
                };
            }
        } catch (err) {
            console.log(err);
        }
    };

    // to send request if nonfriend
    const sendFriendRequest = async () => {
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

    // to accept friend request
    const acceptFriendRequest = async () => {
        profile.friends.push(uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+profile.uid)
                .update({
                    friends: profile.friends
                });
        friendData.friends.push(profile.uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+uid)
                .update({
                    friends: friendData.friends
                });
        const cleansedFriendRequests = profile.friendRequests.filter(id=>id!==uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+profile.uid)
                .update({
                    friendRequests: cleansedFriendRequests
                });
        const cleansedPendingFriendRequests = friendData.pendingFriendRequests.filter(id=>id!==profile.uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+uid)
                .update({
                    pendingFriendRequests: cleansedPendingFriendRequests
                });
                
            }
            
    // decline friend request
    const declineFriendRequest = async () => {
        const cleansedFriendRequests = profile.friendRequests.filter(id=>id!==uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+profile.uid)
                .update({
                    friendRequests: cleansedFriendRequests
                });
        const cleansedPendingFriendRequests = friendData.pendingFriendRequests.filter(id=>id!==profile.uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+uid)
                .update({
                    pendingFriendRequests: cleansedPendingFriendRequests
                });
        setFriendMode('nonfriend');
    }

    // delete friend
    const deleteFriend = async () => {
        // const cleansedFriends = profile.friends.filter(id=>id!==uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+profile.uid)
                .update({
                    friends: firebase.firestore.FieldValue.arrayRemove(uid)
                });
        // const cleansedFriendsPeer = friendData.friends.filter(id=>id!==profile.uid);
        await fire
                .firestore()
                .collection('users')
                .doc(""+uid)
                .update({
                    friends: firebase.firestore.FieldValue.arrayRemove(profile.uid)
                });
    }

    // navigate to other pages
    const navigateToHeroScreen = useContext(NavigateHeroContext);
    const navigateToChatroom = useContext(NavigateChatroomContext);

    // start private chatting
    const createPrivateChatroom = async () => {
        const privateChatroomId = profile.uid+'vs'+uid;
        const privateChatroomIdPeer = uid+'vs'+profile.uid;
        const privateChatroom = await fire
                                        .firestore()
                                        .collection('chatrooms')
                                        .doc(privateChatroomId)
                                        .get();
        const privateChatroomPeer = await fire
                                        .firestore()
                                        .collection('chatrooms')
                                        .doc(privateChatroomIdPeer)
                                        .get();
        if(!privateChatroom.exists && !privateChatroomPeer.exists){
            await fire
                    .firestore()
                    .collection('chatrooms')
                    .doc(privateChatroomId)
                    .set({
                        chatroomId: privateChatroomId,
                        chatroomType: 'private',
                        chatroomMembers: [
                            profile.uid,
                            uid
                        ],
                        chatroomName: privateChatroomId
                    }).then(async()=>{
                        profile.chatrooms.push(privateChatroomId);
                        await fire
                                .firestore()
                                .collection('users')
                                .doc(profile.uid)
                                .update({
                                    chatrooms: profile.chatrooms
                                });
                        friendData.chatrooms.push(privateChatroomId);
                        await fire
                                .firestore()
                                .collection('users')
                                .doc(uid)
                                .update({
                                    chatrooms: friendData.chatrooms
                                }).then(()=>{
                                    navigateToChatroom(privateChatroomId);
                                    navigateToHeroScreen('chatroom');
                                });
                    });
        } else if(privateChatroom.exists){
            navigateToChatroom(privateChatroomId);
            navigateToHeroScreen('chatroom');
        } else if(privateChatroomPeer.exists){
            navigateToChatroom(privateChatroomIdPeer);
            navigateToHeroScreen('chatroom');

        }
    }

    // functions being run on refresh
    useEffect(()=>{
        getFriendData();
        initializeFriendRequestContext();
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
                        <label>
                            <WbSunnyIcon style={{color: grey[50]}}/>
                        </label>
                    ):(
                        <label>
                            <NightsStayIcon style={{color: grey[50]}}/>
                        </label>
                    )}
                    &nbsp;&nbsp;

                    {/* chat the friend */}
                    <label onClick={()=>{
                        createPrivateChatroom();
                    }}>
                        <ChatBubbleIcon style={{fontSize: 25, color: grey[50]}}/>
                    </label>
                    {/* &nbsp;&nbsp;
                    <label onClick={deleteFriend}>
                        <CancelIcon style={{fontSize: 25, color: grey[50]}}/>
                    </label> */}
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
            {friendMode==='pending' &&
                <div className="friend_buttons">
                    {/* wait for reply */}
                    <label>
                        <AccessTimeIcon style={{fontSize: 25, color: grey[50]}}/>
                    </label>
                </div>
            }
            {friendMode==='requested' &&
                <div className="friend_buttons">
                    {/* accept */}
                    <label onClick={acceptFriendRequest}>
                        <DoneIcon style={{fontSize: 25, color: lightGreen[400]}}/>
                    </label>
                    &nbsp;
                    &nbsp;
                    {/* decline */}
                    <label onClick={declineFriendRequest}>
                        <ClearIcon style={{fontSize: 25, color: red[400]}}/>
                    </label>
                </div>
            }
            {friendMode==='addToGroup' &&
                <div className="friend_buttons">
                    {/* add to group action */}
                    <label>
                        <GroupAddIcon style={{fontSize: 27, color: grey[50]}}/>
                    </label>
                </div>
            }
        </div>
    )
}

export default Friend
