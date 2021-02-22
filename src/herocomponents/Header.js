import React, {useContext, useState} from 'react'
import './Header.css'
import discordlogo from './Discord-Logo-Color.png'
import { ProfileContext, LogoutContext } from '../App'
import Drawer from '@material-ui/core/Drawer';
import discordLogo from '../DiscordWhite.png'
import {NavigateHeroContext} from '../Hero'
import HomeIcon from '@material-ui/icons/Home';
import ForumIcon from '@material-ui/icons/Forum';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { indigo } from '@material-ui/core/colors'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Chatroombtn from './Chatroombtn'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import fire from '../Fire'
import firebase from 'firebase'

function Header() {
    const profile = useContext(ProfileContext);
    const logout = useContext(LogoutContext);

    // navigate
    const [viewNavigateDrawer, setViewNavigateDrawer] = useState(false)
    const openNavigateDrawer = () => {
        setViewNavigateDrawer(true);
    }
    const closeNavigateDrawer = () => {
        setViewNavigateDrawer(false);
    }
    // navigate to other pages
    const navigateToHeroScreen = useContext(NavigateHeroContext);

    // navigate chatrooms
    const [viewNavigateChatroom, setViewNavigateChatroom] = useState(false)
    const openNavigateChatroom = () => {
        setViewNavigateChatroom(true)
    }
    const closeNavigateChatroom = () => {
        setViewNavigateChatroom(false)
    }

    // create group dialog
    const [viewCreateGroupDialog, setViewCreateGroupDialog] = useState(false)
    const openCreateGroupDialog = () => {
        setViewCreateGroupDialog(true)
    }
    const closeCreateGroupDialog = () => {
        setViewCreateGroupDialog(false)
    }
    const [newGroupName, setNewGroupName] = useState('')
    const createGroup = async () => {
        const chid = ''+profile.uid+Date.now();
        await fire  // create the chatroom doc
                .firestore()
                .collection('chatrooms')
                .doc(chid)
                .set({
                    chatroomId: chid,
                    chatroomType: 'group',
                    chatroomMembers: [
                        profile.uid
                    ],
                    chatroomName: newGroupName,
                    photoURL: 'https://firebasestorage.googleapis.com/v0/b/discordclone-2b382.appspot.com/o/app%2FBusiness__28119_29.jpg?alt=media&token=1c273128-5c4a-4498-b02e-a3ed3d9ef073'
                }).then(async ()=>{
                    setNewGroupName(''); // empty the new groupName container
                    await fire
                            .firestore()
                            .collection('users')
                            .doc(profile.uid)
                            .update({
                                chatrooms: firebase.firestore.FieldValue.arrayUnion(chid)
                            }) 
                });
    }

    return (
        <div className="header">
            <div className="headercontainer">
                <React.Fragment key='left'>
                    <label className="navigatedrawerbtn" onClick={openNavigateDrawer}>
                        <img src={discordlogo}/>
                    </label>
                    <Drawer
                        anchor='left'
                        open={viewNavigateDrawer}
                        onClose={closeNavigateDrawer}
                        BackdropProps={{style: {backgroundColor: 'transparent'}}}
                    >
                        <div className="navdrawerdiv">
                            <div className="navdrawerlogo">
                            <img className="discordlogo" src={discordLogo}/>
                            </div>
                            <label className="navdrawermenubtn" onClick={()=>{
                                navigateToHeroScreen('home');
                            }}>
                                <HomeIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Home.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                openNavigateChatroom();
                                closeNavigateDrawer();
                            }}>
                                <ForumIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Chatrooms.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                navigateToHeroScreen('profile');
                            }}>
                                <AccountBoxIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Profile.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={logout}>
                                <ExitToAppIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Logout.
                                </p>
                            </label>
                        </div>
                    </Drawer>
                </React.Fragment>
                <React.Fragment key='left'>
                    <Drawer
                        anchor='left'
                        open={viewNavigateChatroom}
                        onClose={closeNavigateChatroom}
                        BackdropProps={{style: {backgroundColor: 'transparent'}}}
                    >
                        <div className="navdrawerdiv">
                            <div className="navdrawerlogo">
                                <img className="discordlogo" src={discordLogo}/>
                            </div>
                            <label className="navdrawermenubtn" onClick={()=>{
                                closeNavigateChatroom();
                                openNavigateDrawer();
                            }}>
                                <ForumIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Chatrooms.
                                </p>
                            </label>
                            {profile.chatrooms!==undefined && profile.chatrooms.map(id=>(
                                <Chatroombtn chatroomId={id}/>
                            ))}
                            <label className="navdrawermenubtn" onClick={()=>{
                                closeNavigateChatroom();
                                navigateToHeroScreen('home');
                            }}>
                                <PersonIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Chat with more friends.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                closeNavigateChatroom();
                                openCreateGroupDialog();
                            }}>
                                <GroupIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Create New Group.
                                </p>
                            </label>
                            <label className="navdrawermenubtn" onClick={()=>{
                                closeNavigateChatroom();
                                openNavigateDrawer();
                            }}>
                                <ArrowBackIosIcon style={{fontSize: 25, color: indigo[300]}}/>
                                <p>
                                Back.
                                </p>
                            </label>
                        </div>
                    </Drawer>

                </React.Fragment>
                <Dialog 
                    open={viewCreateGroupDialog} 
                    onClose={closeCreateGroupDialog} 
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
                            Create New Group
                        </p>
                    </DialogTitle>
                    <DialogContent>
                        <div className="newgroupcontent">
                            <div className="newgroupcontentinput">
                                <input
                                    className="newgroupdialoginput"
                                    type="text"
                                    value={newGroupName}
                                    placeholder="Type Group Name.."
                                    onChange={(e)=>setNewGroupName(e.target.value)}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>{
                        closeCreateGroupDialog();
                        setNewGroupName('');
                    }} color="primary">
                        <p className="dialogtitle2">
                            Cancel
                        </p>
                    </Button>
                    <Button onClick={()=>{
                        closeCreateGroupDialog();
                        createGroup();
                    }} color="primary">
                        <p className="dialogtitle2">
                            Create
                        </p>
                    </Button>
                    </DialogActions>
                </Dialog>
                <img src={profile.photoURL}/>
            </div>
        </div>
    )
}

export default Header
