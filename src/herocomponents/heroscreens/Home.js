import React, {useState} from 'react'
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
import SearchIcon from '@material-ui/icons/Search';
import fire from '../../Fire'

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
        const snapshot = await fire
                                .firestore()
                                .collection('users')
                                .where('email', '==', newFriendEmail)
                                .get();
        setNewFriendEmail('');
        if (snapshot.empty){
            console.log('No Match');
        } else {
            snapshot.forEach(doc => {
                friendResult.push(doc.data());
                console.log(doc.data());
            });
            setHasFriendResult(true);
        }
    }

    // dummy contacts
    const contacts = [
        {
            uid: "nsakjna92nwe73bwnbd73",
            status: "online",
            displayName: "IrhamIsa",
            photoURL: "https://i.pinimg.com/originals/99/c5/be/99c5be5f7e9e863f2d93ad64f431ca93.jpg",
            email: "irhamisa@google.com"
        },
        {
            uid: "danjus9akjnaals6al77",
            status: "offline",
            displayName: "ZakiRahman",
            photoURL: "https://pbs.twimg.com/profile_images/1131624264405327873/1YpVVtxD_400x400.jpg",
            email: "zakirahman@google.com"
        }
    ]
    return (
        <div className="home">
            <Breadcrumb address="Home."/>
            <div className="home_content">
                <div className="home_header">
                    <p>Start Chatting!</p>
                    <label className="addfriendslabel" onClick={openAddFriendsInput}>
                        <PersonAddIcon style={{fontSize: 27, color: grey[50]}}/>
                    </label>
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
                                            displayName={user.displayName}
                                            photoURL={user.photoURL}
                                            email={user.email}
                                            status={user.status}
                                            addToGroupEnabled={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={closeAddFriendsInput} color="primary">
                            <p className="dialogtitle2">
                                Cancel
                            </p>
                        </Button>
                        <Button onClick={()=>{
                            closeAddFriendsInput();
                        }} color="primary">
                            <p className="dialogtitle2">
                                Done
                            </p>
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                {contacts.map(contact=>(
                    <Friend
                        key={contact.uid}
                        uid={contact.uid}
                        displayName={contact.displayName}
                        photoURL={contact.photoURL}
                        email={contact.email}
                        status={contact.status}
                        addToGroupEnabled={false}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
