import React, {useContext, useState, useEffect} from 'react'
import './Home.css'
import Friend from '../Friend'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { grey } from '@material-ui/core/colors'
import Breadcrumb from '../Breadcrumb';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import SearchIcon from '@material-ui/icons/Search';
import fire from '../../Fire'
import {ProfileContext} from '../../App'
import Badge from '@material-ui/core/Badge';

function Home() {
    // handling add friends
    const [open, setOpen] = useState(false)
    const openAddFriendsInput = () => {
        setOpen(true);  // opens add frineds dialog
    }
    const closeAddFriendsInput = () => {
        setOpen(false);  // opens add frineds dialog
        setNewFriendEmail('');
        friendResult.splice(0, friendResult.length);
        setHasFriendResult(false);
    }
    const [newFriendEmail, setNewFriendEmail] = useState('')
    const [friendResult] = useState([])
    const [hasFriendResult, setHasFriendResult] = useState(false)
    const searchFriend = async () => {
        friendResult.splice(0, friendResult.length); // clears the friendresult array
        setHasFriendResult(false);  // clears the friendresult display
        const snapshot = await fire
                                .firestore()
                                .collection('users')
                                .where('email', '==', newFriendEmail)
                                .get();
        setNewFriendEmail('');
        if (snapshot.empty){
            console.log('Friend-Search-by-Email: no users found with that email');
        } else {
            snapshot.forEach(doc => {
                friendResult.push(doc.data());
            });
            setHasFriendResult(true);
        }
    }

    // get friends methods
    const profile = useContext(ProfileContext)
    const [friendsList] = useState([])
    const [hasFriendsList, setHasFriendsList] = useState(false)
    const getFriendsList = () => {
        try {
            if(profile.friends===undefined){
                throw "error: cannot find profile.friends";
            } else {
                setHasFriendsList(false);
                friendsList.splice(0, friendsList.length);
                profile.friends.forEach(uid=>{
                    friendsList.push(uid);
                });
                if(profile.friends.length!==0){
                    setHasFriendsList(true);
                };
            }
        } catch (err) {
            console.log(err);
        }
    }

    // get friendrequests
    const [viewFriendRequestsDialog, setViewFriendRequestsDialog] = useState(false)
    const openFriendRequestsDialog = () => {
        setViewFriendRequestsDialog(true);
    }
    const closeFriendRequestsDialog = () => {
        setViewFriendRequestsDialog(false);
    }
    try {
        if(profile.friends===undefined){
            throw "error: cannot find profile.friends";
        } else {
            if(profile.friendRequests===undefined){
                profile.friendRequests=[];
            };
        }
    } catch (err) {
        console.log(err);
    }

    

    // functions being run on refresh
    useEffect(()=>{
        getFriendsList();
    }, [profile])

    return (
        <div className="home">
            <Breadcrumb address="Home."/>
            <div className="home_content">
                <div className="home_header">
                    <p>Start Chatting!</p>
                    <div className="home_headerbtn">
                    <label className="addfriendslabel" onClick={openAddFriendsInput}>
                        <PersonAddIcon style={{fontSize: 27, color: grey[50]}}/>
                    </label>
                    &nbsp;
                    &nbsp;
                    {(profile.friendRequests!==undefined && profile.friendRequests.length===0) &&
                        <label className="friendrequestslabel" onClick={openFriendRequestsDialog}>
                            <PersonPinIcon style={{fontSize: 27, color: grey[50]}}/>
                        </label>
                    }
                    {(profile.friendRequests!==undefined && profile.friendRequests.length!==0) &&
                        <label className="friendrequestslabel" onClick={openFriendRequestsDialog}>
                            <Badge badgeContent={profile.friendRequests.length} color="primary">
                                <PersonPinIcon style={{fontSize: 27, color: grey[50]}}/>
                            </Badge>
                        </label>
                    }
                    </div>
                    <Dialog 
                        open={open} 
                        onClose={closeAddFriendsInput} 
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
                                Add New Friends
                            </p>
                        </DialogTitle>
                        <DialogContent>
                            <div className="addfriendscontent">
                                <div className="addfriendscontentinput">
                                    <input
                                        className="addfriendsdialoginput"
                                        type="email"
                                        value={newFriendEmail}
                                        placeholder="Type Friend's Email.."
                                        onChange={(e)=>setNewFriendEmail(e.target.value)}
                                    />
                                    &nbsp;&nbsp;&nbsp;
                                    <label onClick={()=>{
                                        searchFriend();
                                    }}>
                                        <SearchIcon style={{fontSize: 27, color: grey[50]}}/>
                                    </label>
                                </div>
                                &nbsp;
                                &nbsp;
                                <div className="addfriendsresult">
                                    {hasFriendResult && friendResult.map(user=>(
                                        <Friend
                                            key={user.uid}
                                            uid={user.uid}
                                            addToGroupEnabled={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={()=>{
                            closeAddFriendsInput();
                        }} color="primary">
                            <p className="dialogtitle2">
                                Done
                            </p>
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog 
                        open={viewFriendRequestsDialog} 
                        onClose={closeFriendRequestsDialog} 
                        aria-labelledby="friendreq-dialog-title"
                        PaperProps={{
                            style: {
                                backgroundColor: "#23272A",
                                boxShadow: "none"
                            },
                        }}
                    >
                        <DialogTitle id="friendreq-dialog-title">
                            <p className="dialogtitle1">
                                Friend Requests
                            </p>
                        </DialogTitle>
                        <DialogContent>
                            <div className="friendrequestscontent">
                                {profile.friendRequests!==undefined && profile.friendRequests.map(id=>(
                                    <Friend
                                        key={id}
                                        uid={id}
                                        addToGroupEnabled={false}
                                    />
                                ))}
                                {(profile.friendRequests!==undefined && profile.friendRequests.length===0) &&
                                    <p className="nofriendsmsg">You have no friend requests!</p>
                                }
                            </div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={()=>{
                            closeFriendRequestsDialog();
                        }} color="primary">
                            <p className="dialogtitle2">
                                Done
                            </p>
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                {hasFriendsList && friendsList.map(uid=>(
                    <Friend
                        key={uid}
                        uid={uid}
                        addToGroupEnabled={false}
                    />
                ))}
                {!hasFriendsList &&
                    <p className="nofriendsmsg">You have no chat friends yet. Find friends now!</p>
                }
            </div>
        </div>
    )
}

export default Home
