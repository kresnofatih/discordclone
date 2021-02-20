import React, {useState, useContext, useEffect} from 'react'
import {ProfileContext} from '../../App'
import {NavigateHeroContext} from '../../Hero'
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
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Grid} from '@giphy/react-components'
import {GiphyFetch} from '@giphy/js-fetch-api'

const giphyFetch = new GiphyFetch('GmEpz4LrLGIaULoHRzb42jiIqR35yX8k');

function GridGiphy({onGifClick, searchKeyword}){
    // const [gifData, setGifData] = useState('')
    const fetchGifs = (offset) => giphyFetch.search(searchKeyword, {offset, limit: 10});
    return (
        <Grid
            onGifClick={onGifClick}
            fetchGifs={fetchGifs}
            width={300}
            columns={2}
            gutter={6}
        />
    )
}

function Chatroom({chatroomId}) {
    // personal profile loader
    const profile = useContext(ProfileContext)

    // chatroom info loader
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
                // console.log(chatroomMembersCleansed);
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
        friendData.uid = doc.data().uid;
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

    // msg sender
    const [chatMsg, setChatMsg] = useState('')
    const sendChat = (e) => {
        e.preventDefault();
        // console.log(chatMsg);
        setChatMsg('');
        const d = new Date();
        fire
            .firestore()
            .collection('chatrooms')
            .doc(chatroomInfo.chatroomId)
            .collection('chats')
            .add({
                uid: profile.uid,
                msg: chatMsg,
                timestamp: d.toUTCString(),
                timestampSeconds: Date.now()
            });
    }
    
    // chatlog listener
    const [chatLog, setChatLog] = useState([])
    const chatLogListener = () => {
        fire
            .firestore()
            .collection('chatrooms')
            .doc(chatroomId)
            .collection('chats')
            .onSnapshot(snapshot=>(
                setChatLog(snapshot.docs.map(doc=>doc.data()).sort((a,b)=>{
                    return b.timestampSeconds-a.timestampSeconds
                }))
            ));
    }

    // navigate to other pages
    const navigateToHeroScreen = useContext(NavigateHeroContext);

    // open gif searcher
    const [viewGifDialog, setViewGifDialog] = useState(false)
    const openGifDialog = () => {
        setViewGifDialog(true);
    }
    const closeGifDialog = () => {
        setViewGifDialog(false);
    }

    // functions being run on refresh/change of parameters
    useEffect(()=>{
        getChatroomInfo();
        chatLogListener();
    }, [profile])
    return (
        <div className="chatroom">
            <Breadcrumb address="Chatroom."/>
            <div className="chatroom_content">
                {hasChatroomInfo && hasFriendData && chatroomInfo.chatroomType==='private' &&
                    <div className="chatroom_header">
                        <div className="chatroom_headersides">
                            <img className="chatroompic" src={friendData.photoURL}/>
                            {/* <CodeIcon style={{fontSize: 27, color: grey[50]}}/> */}
                            &nbsp;
                            &nbsp;
                            <p className="chatroom_name">{friendData.displayName}</p>
                        </div>
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
                                        <div className="profile_content_field">
                                            <p className="profile_content_placeholder">UID:</p>
                                            <p className="profile_content_fieldvalue">{friendData.uid}</p>
                                        </div>
                                        <div className="profile_content_field">
                                            <p className="profile_content_placeholder">EMAIL:</p>
                                            <p className="profile_content_fieldvalue">{friendData.email}</p>
                                        </div>
                                        <div className="profile_content_field">
                                            <p className="profile_content_placeholder">STATUS:</p>
                                            &nbsp;
                                            {friendData.status==='online' ? (
                                                <label>
                                                    <WbSunnyIcon style={{color: grey[50]}}/>
                                                </label>
                                            ):(
                                                <label>
                                                    <NightsStayIcon style={{color: grey[50]}}/>
                                                </label>
                                            )}
                                            {/* <p className="profile_content_fieldvalue">{friendData.status}</p> */}
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
                    {hasChatroomInfo && hasFriendData && chatLog.map(chat=>(
                        <Chatitem 
                            uid={chat.uid}
                            timestamp={chat.timestamp}
                            msg={chat.msg}
                        />
                    ))}
                </div>
                {hasChatroomInfo && hasFriendData && 
                <div className="chatroom_footer">
                    <div className="chatroom_headersides">
                        <AddCircleIcon style={{fontSize: 22, color: grey[50]}}/>
                        &nbsp;
                        &nbsp;
                        <form className="chatform" action="" onSubmit={sendChat}>
                            <input
                                className="chatbox"
                                onChange={e=>setChatMsg(e.target.value)} 
                                value={chatMsg}
                                placeholder="Chat Now!"
                                type="text"
                            />
                        </form>
                    </div>
                    <div className="chatroom_headersides">
                        <label onClick={openGifDialog}>
                            <GifIcon style={{fontSize: 40, color: grey[50]}}/>
                        </label>
                        <Dialog 
                            open={viewGifDialog} 
                            onClose={closeGifDialog} 
                            aria-labelledby="form-dialog-title-gifsender"
                            PaperProps={{
                                style: {
                                    backgroundColor: "#23272A",
                                    boxShadow: "none"
                                },
                            }}
                        >
                            <DialogTitle id="form-dialog-title-gifsender">
                                <p className="dialogtitle1">
                                    Send a Gif!
                                </p>
                            </DialogTitle>
                            <DialogContent>
                                <div className="gifgrid">
                                <GridGiphy
                                    onGifClick={(gif, e)=>{
                                        e.preventDefault();
                                        console.log(gif);
                                        closeGifDialog();
                                    }}
                                    searchKeyword="anime cute"
                                />
                                </div>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={()=>{
                                closeGifDialog();
                            }} color="primary">
                                <p className="dialogtitle2">
                                    Close
                                </p>
                            </Button>
                            </DialogActions>
                        </Dialog>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <label>
                            <EmojiEmotionsIcon style={{fontSize: 22, color: grey[50]}}/>
                        </label>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default Chatroom
