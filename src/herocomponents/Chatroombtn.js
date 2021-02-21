import React, {useContext, useState, useEffect} from 'react'
import './Chatroombtn.css'
import {ProfileContext} from '../App'
import fire from '../Fire'
import { grey } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress';


function Chatroombtn({chatroomId}) {
    // profile context
    const profile = useContext(ProfileContext)

    // get chatroom
    const [chatroomInfo] = useState({})
    const [hasChatroomInfo, setHasChatroomInfo] = useState(false)
    const getChatroomInfo = async () => {
        setHasChatroomInfo(false);
        const chatroominfo = await fire
                                    .firestore()
                                    .collection('chatrooms')
                                    .doc(chatroomId)
                                    .get();
        if(chatroominfo.exists){
            chatroomInfo.chatroomId = chatroominfo.data().chatroomId;
            chatroomInfo.chatroomMembers = chatroominfo.data().chatroomMembers;
            chatroomInfo.chatroomType = chatroominfo.data().chatroomType;
            if(chatroomInfo.chatroomType==='private'){
                const chatroomMembersCleansed = chatroomInfo.chatroomMembers.filter(id=>id!==profile.uid);
                getFriendData(chatroomMembersCleansed[0]).then(()=>{
                    setHasChatroomInfo(true);
                }) // getfriend data from remaining id
            } else {
                chatroomInfo.chatroomName = chatroominfo.data().chatroomName;
                chatroomInfo.photoURL = chatroominfo.data().photoURL;
                setHasChatroomInfo(true);
            }
        } else {
            console.log('no such data');
        }
    }

    // get friend data if private chat
    const [friendData] = useState({})
    const getFriendData = async (id) => {
        const doc = await fire
                            .firestore()
                            .collection('users')
                            .doc(id)
                            .get();
        friendData.displayName = doc.data().displayName;
        friendData.photoURL = doc.data().photoURL;
        friendData.uid = doc.data().uid;

        // assign private chat photo and room name
        chatroomInfo.chatroomName = friendData.displayName;
        chatroomInfo.photoURL = friendData.photoURL;
    }

    useEffect(()=>{
        getChatroomInfo();
    }, [])
    return (
        <label className="chatroombtn">
            {!hasChatroomInfo &&
                <div className="chatroombtnboxloading">
                    <CircularProgress style={{color: grey[50]}}/>
                </div>
            }
            {hasChatroomInfo &&
                <div className="chatroombtnbox">
                    <img src={chatroomInfo.photoURL} />
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <p>{chatroomInfo.chatroomName}</p>
                </div>
            }
        </label>
    )
}

export default Chatroombtn
