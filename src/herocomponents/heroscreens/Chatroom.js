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
import Friend from '../Friend'
import {GiphyFetch} from '@giphy/js-fetch-api'

const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHYAPIKEY);

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
            } else {
                chatroomInfo.chatroomType='group';
            }
            chatroomInfo.chatroomName = chatroominfo.data().chatroomName;
            if(chatroominfo.data().photoURL!==undefined){
                chatroomInfo.photoURL = chatroominfo.data().photoURL;
            }
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
        setChatMsg('');
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
    const [gifKeyword, setGifKeyword] = useState('')
    const [hasGifKeyword, setHasGifKeyword] = useState(true)
    const [gifSearchKeyword, setGifSearchKeyword] = useState('anime')
    const [viewGifDialog, setViewGifDialog] = useState(false)
    const openGifDialog = () => {
        setViewGifDialog(true);
    }
    const closeGifDialog = () => {
        setViewGifDialog(false);
    }
    const submitGifKeyword = (e) => {
        // setHasGifKeyword(false);
        e.preventDefault();
        setGifSearchKeyword(gifKeyword);
        setGifKeyword('');
        setHasGifKeyword(true);
    }
    const sendGifChat = (gifMsg)=> {
        const d = new Date();
        fire
            .firestore()
            .collection('chatrooms')
            .doc(chatroomInfo.chatroomId)
            .collection('chats')
            .add({
                uid: profile.uid,
                msg: gifMsg,
                timestamp: d.toUTCString(),
                timestampSeconds: Date.now()
            });
    }

    // file link sender
    const sendFileLinkChat = (e) => {
        const file = e.target.files[0];
        const storageRef = fire.storage().ref();
        const fileRef = storageRef.child('chatrooms/files/'+chatroomInfo.chatroomId+'/'+file.name)
        fileRef
            .put(file)
            .then(()=>{
                fileRef
                    .getDownloadURL()
                    .then(url=>{
                        const d = new Date();
                        fire
                            .firestore()
                            .collection('chatrooms')
                            .doc(chatroomInfo.chatroomId)
                            .collection('chats')
                            .add({
                                uid: profile.uid,
                                msg: 'discordclonelink:'+url,
                                timestamp: d.toUTCString(),
                                timestampSeconds: Date.now()
                            })
                    })
            })
    }

    // add members to group
    const [viewAddMembersToGroup, setViewAddMembersToGroup] = useState(false)
    const openAddMembersToGroup = () => {
        setViewAddMembersToGroup(true)
    }
    const closeAddMembersToGroup = () => {
        setViewAddMembersToGroup(false)
    }

    // view groupinfo drawer
    const [viewGroupInfo, setViewGroupInfo] = useState(false)
    const openGroupInfo = () => {
        setViewGroupInfo(true)
    }
    const closeGroupInfo = () => {
        setViewGroupInfo(false)
    }
    // update group photoURL methods
    const updateGroupPhotoURLToFirestore = (e) => {
        const file = e.target.files[0];
        const storageRef = fire.storage().ref();
        const d = new Date();
        const fileRef = storageRef.child('chatrooms/photoURL/'+chatroomId+'/'+d.toLocaleString().replace("/", "_").replace("/", "_").replace(" ", "_"));
        fileRef
            .put(file)  // store photo File to Firebase Storage
            .then(()=>{
                fileRef
                    .getDownloadURL()
                    .then(url=>{
                        fire
                            .firestore()
                            .collection('chatrooms')
                            .doc(chatroomId)
                            .update({
                                photoURL: url
                            });     // store photo URL to firebase firestore
                        refreshOnEvent();
                    });
            });
    }
    const [chatroomUpdates, setChatroomUpdates] = useState(0)
    const refreshOnEvent=()=> {
        setChatroomUpdates(chatroomUpdates+1)
    }
    // update groupname
    const [tempGroupName, setTempGroupName] = useState('')
    const [viewRenameGroup, setViewRenameGroup] = useState(false)
    const openRenameGroup =()=>{
        setViewRenameGroup(true)
    }
    const closeRenameGroup =()=>{
        setViewRenameGroup(false)
    }
    const renameGroup = async()=>{
        await fire
                .firestore()
                .collection('chatrooms')
                .doc(chatroomId)
                .update({
                    chatroomName: tempGroupName
                }).then(()=>{
                    setTempGroupName('');
                    refreshOnEvent();
                })
    }

    // functions being run on refresh/change of parameters
    useEffect(()=>{
        getChatroomInfo();
        chatLogListener();
    }, [profile, chatroomId, chatroomUpdates])
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
                            <img className="chatroompic" src={chatroomInfo.photoURL}/>
                            {/* <CodeIcon style={{fontSize: 27, color: grey[50]}}/> */}
                            &nbsp;
                            &nbsp;
                            <p className="chatroom_name">{chatroomInfo.chatroomName}</p>
                        </div>
                        <div className="chatroom_headersides">
                            <label onClick={()=>{
                                openAddMembersToGroup();
                            }}>
                                <GroupAddIcon style={{fontSize: 27, color: grey[50]}}/>
                            </label>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <React.Fragment key='right'>
                                <label onClick={openGroupInfo}>
                                    <GroupIcon style={{fontSize: 25, color: grey[50]}}/>
                                </label>
                                <Drawer 
                                    anchor='right' 
                                    open={viewGroupInfo} 
                                    onClose={closeGroupInfo}
                                    BackdropProps={{style: {backgroundColor: 'transparent'}}}
                                >
                                    <div className="drawerdiv">
                                        <input
                                            className="hidden_grouppic_input"
                                            type="file"
                                            id="grouppicfile"
                                            onChange={(e)=>{
                                                updateGroupPhotoURLToFirestore(e);
                                            }}
                                        />
                                        <label for="grouppicfile">
                                            <img className="drawerfriendphoto" src={chatroomInfo.photoURL}/>
                                        </label>
                                        <div className="profile_content_field">
                                            <p className="profile_content_placeholder">GROUP NAME:</p>
                                            <label onClick={openRenameGroup}>
                                                <p className="profile_content_fieldvalue">{chatroomInfo.chatroomName}</p>
                                            </label>
                                            <Dialog 
                                                open={viewRenameGroup} 
                                                onClose={closeRenameGroup} 
                                                aria-labelledby="form-dialog-title"
                                                PaperProps={{
                                                    style: {
                                                        backgroundColor: "#23272A",
                                                        boxShadow: "none"
                                                    },
                                                }}
                                            >
                                                <DialogTitle id="form-dialog-title">
                                                    <p className="dialogtitle1">
                                                        Rename Group
                                                    </p>
                                                </DialogTitle>
                                                <DialogContent>
                                                    <div className="renamegroupcontent">
                                                        <div className="renamegroupcontentinput">
                                                            <input
                                                                className="renamegroupdialoginput"
                                                                type="text"
                                                                value={tempGroupName}
                                                                placeholder="Type Group Name.."
                                                                onChange={(e)=>setTempGroupName(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                                <DialogActions>
                                                <Button onClick={()=>{
                                                    closeRenameGroup()
                                                    setTempGroupName('');
                                                }} color="primary">
                                                    <p className="dialogtitle2">
                                                        Cancel
                                                    </p>
                                                </Button>
                                                <Button onClick={()=>{
                                                    closeRenameGroup();
                                                    if(tempGroupName.length>0){
                                                        renameGroup();
                                                    };
                                                }} color="primary">
                                                    <p className="dialogtitle2">
                                                        Rename
                                                    </p>
                                                </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                    </div>
                                </Drawer>
                            </React.Fragment>
                        </div>
                        <Dialog 
                            open={viewAddMembersToGroup} 
                            onClose={closeAddMembersToGroup} 
                            aria-labelledby="form-dialog-title"
                            PaperProps={{
                                style: {
                                    backgroundColor: "#23272A",
                                    boxShadow: "none"
                                },
                            }}
                        >
                            <DialogTitle id="form-dialog-title">
                                <p className="dialogtitle1">
                                    Add Members To Group.
                                </p>
                            </DialogTitle>
                            <DialogContent>
                                <div className="addmemberscontent">
                                    {profile.friends.map(id=>{
                                        const notAddedToGroup = !chatroomInfo
                                                                    .chatroomMembers
                                                                    .includes(id);
                                        return (
                                            <Friend
                                                key={id}
                                                uid={id}
                                                addToGroupEnabled={notAddedToGroup}
                                            />
                                        )
                                    })}
                                </div>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={()=>{
                                closeAddMembersToGroup();
                            }} color="primary">
                                <p className="dialogtitle2">
                                    Done
                                </p>
                            </Button>
                            </DialogActions>
                        </Dialog>
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
                    {hasChatroomInfo && chatroomInfo.chatroomType==='group' && chatLog.map(chat=>(
                        <Chatitem 
                            uid={chat.uid}
                            timestamp={chat.timestamp}
                            msg={chat.msg}
                        />
                    ))}
                </div>
                {hasChatroomInfo && 
                <div className="chatroom_footer">
                    <div className="chatroom_headersides">
                        <input
                            className="hidden_file_input"
                            type="file"
                            id="fileUploader"
                            onChange={(e)=>{
                                sendFileLinkChat(e);
                            }}
                        />
                        <label for="fileUploader">
                            <AddCircleIcon style={{fontSize: 22, color: grey[50]}}/>
                        </label>
                        &nbsp;
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
                                <form className="chatform" action="" onSubmit={submitGifKeyword}>
                                    <input
                                        className="gifsearchbox"
                                        onChange={e=>{
                                            setHasGifKeyword(false);
                                            setGifKeyword(e.target.value);
                                        }} 
                                        value={gifKeyword}
                                        placeholder="Type Keywords & Press Enter!"
                                        type="text"
                                    />
                                </form>
                                {hasGifKeyword &&
                                    <GridGiphy
                                        onGifClick={(gif, e)=>{
                                            e.preventDefault();
                                            sendGifChat('discordclonegif:'+gif.images.downsized_medium.url);
                                            closeGifDialog();
                                        }}
                                        searchKeyword={gifSearchKeyword}
                                    />
                                }
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
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default Chatroom
