import React, {useState, useContext, useEffect} from 'react'
import {ProfileContext} from '../../App'
import Breadcrumb from '../Breadcrumb'
import './Chatroom.css'
import CodeIcon from '@material-ui/icons/Code';
import { grey } from '@material-ui/core/colors'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import GifIcon from '@material-ui/icons/Gif';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Chatitem from '../Chatitem';
import fire from '../../Fire'
import Drawer from '@material-ui/core/Drawer';

function Chatroom() {
    const profile = useContext(ProfileContext)
    // chatroom info loader
    const [chatroomInfo] = useState({})
    const [hasChatroomInfo, setHasChatroomInfo] = useState(false)
    const getChatroomInfo = async () => {
        setHasChatroomInfo(false);
        const chatroominfo = await fire
                                    .firestore()
                                    .collection('chatrooms')
                                    .doc('uk4pOQjJW1VeB9NXjv9dbaQor242vsWRZbOW0Az5N1FY8ssHXJbRj1w4H2')
                                    .get();
        if(chatroominfo.exists){
            chatroomInfo.chatroomId = chatroominfo.data().chatroomId;
            chatroomInfo.chatroomMembers = chatroominfo.data().chatroomMembers;
            chatroomInfo.chatroomType = chatroominfo.data().chatroomType;
            if(chatroomInfo.chatroomType==='private'){
                const chatroomMembersCleansed = chatroomInfo.chatroomMembers.filter(id=>id!==profile.uid);
                console.log(chatroomMembersCleansed);
                // chatroomInfo.chatroomMembers.forEach(id=>id!==profile.uid);
                getFriendData(chatroomMembersCleansed[0]); // getfriend data from remaining id
                // console.log(chatroomInfo.chatroomMembers.filter(id=>id!==profile.uid)); // getfriend data from remaining id
                // console.log(profile.uid); 
            }
            chatroomInfo.chatroomName = chatroominfo.data().chatroomName;
            setHasChatroomInfo(true);
        } else {
            console.log('no such data');
        }
    }

    // chatpeer info
    const [friendData] = useState({})
    const [hasFriendData, setHasFriendData] = useState(false);
    const getFriendData = async (id) => {
        setHasFriendData(false);
        const doc = await fire
                            .firestore()
                            .collection('users')
                            .doc(id)
                            .get();
        friendData.displayName = doc.data().displayName;
        friendData.photoURL = doc.data().photoURL;
        friendData.email = doc.data().email;
        friendData.status = doc.data().status;
        setHasFriendData(true);
    }

    // profile drawer
    const [viewProfileDrawer, setViewProfileDrawer] = useState(false)
    const openProfileDrawer = () => {
        setViewProfileDrawer(true);
    }
    const closeProfileDrawer = () => {
        setViewProfileDrawer(false);
    }


    // functions being run on refresh/change of parameters
    useEffect(()=>{
        getChatroomInfo();
    }, [profile])
    return (
        <div className="chatroom">
            <Breadcrumb address="Chatroom."/>
            <div className="chatroom_content">
                {chatroomInfo.chatroomType==='private' &&
                    <div className="chatroom_header">
                        {hasFriendData &&
                            <div className="chatroom_headersides">
                                <CodeIcon style={{fontSize: 27, color: grey[50]}}/>
                                &nbsp;
                                &nbsp;
                                <p className="chatroom_name">{friendData.displayName}</p>
                            </div>
                        }
                        <div className="chatroom_headersides">
                            <React.Fragment key='right'>
                                <label onClick={openProfileDrawer}>
                                    <PersonIcon style={{fontSize: 27, color: grey[50]}}/>
                                </label>
                                <Drawer 
                                    anchor='right' 
                                    open={viewProfileDrawer} 
                                    onClose={closeProfileDrawer}
                                    BackdropProps={{style: {backgroundColor: 'transparent'}}}
                                >
                                    <div className="drawerdiv">
                                        <img className="drawerfriendphoto" src={friendData.photoURL}/>
                                        <div className="profile_content_field">
                                            <p className="profile_content_placeholder">DISPLAY NAME:</p>
                                            <p className="profile_content_fieldvalue">{friendData.displayName}</p>
                                        </div>
                                    </div>
                                </Drawer>
                            </React.Fragment>
                        </div>
                    </div>
                }
                {chatroomInfo.chatroomType==='group' &&
                    <div className="chatroom_header">
                        <div className="chatroom_headersides">
                            <CodeIcon style={{fontSize: 27, color: grey[50]}}/>
                            &nbsp;
                            &nbsp;
                            <p className="chatroom_name">{chatroomInfo.chatroomName}</p>
                        </div>
                        <div className="chatroom_headersides">
                            <GroupAddIcon style={{fontSize: 27, color: grey[50]}}/>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <GroupIcon style={{fontSize: 27, color: grey[50]}}/>
                        </div>
                    </div>
                }
                <div className="chatroom_chatlog">
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                    <Chatitem/>
                </div>
                <div className="chatroom_footer">
                    <div className="chatroom_headersides">
                        <AddCircleIcon style={{fontSize: 22, color: grey[50]}}/>
                        &nbsp;
                        &nbsp;
                        <p className="chatroom_name">bacotan</p>
                    </div>
                    <div className="chatroom_headersides">
                        <GifIcon style={{fontSize: 40, color: grey[50]}}/>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <EmojiEmotionsIcon style={{fontSize: 22, color: grey[50]}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatroom
