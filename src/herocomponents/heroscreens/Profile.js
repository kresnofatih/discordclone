import React, {useContext, useState} from 'react'
import './Profile.css'
import { ProfileContext } from '../../App'
import fire from '../../Fire'
import EditIcon from '@material-ui/icons/Edit'
import { grey } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Breadcrumb from '../Breadcrumb'

function Profile() {
    // get profile context from App.js
    const profile = useContext(ProfileContext) 
    
    // update displayName states & methods
    const [open, setOpen] = useState(false) // when true=>dialog opens, false=>closes
    const openDisplayNameInput = () => {
        setOpen(true);  // opens newdisplayName dialog
    }
    const closeDisplayNameInput = () => {
        setOpen(false); // closes newdisplayName dialog
    }
    const [newDisplayName, setNewDisplayName] = useState('') // value container for new displayName
    const storeNewDisplayNameToFirestore = () => {
        fire
            .firestore()
            .collection('users')
            .doc(profile.uid)
            .update({
                displayName: newDisplayName
            });
    }

    // update photoURL methods
    const updatePhotoURLToFirestore = (e) => {
        const file = e.target.files[0];
        const storageRef = fire.storage().ref();
        const d = new Date();
        const fileRef = storageRef.child('users/photoURL/'+profile.uid+'/'+d.toLocaleString().replace("/", "_").replace("/", "_").replace(" ", "_"));
        fileRef
            .put(file)  // store photo File to Firebase Storage
            .then(()=>{
                fileRef
                    .getDownloadURL()
                    .then(url=>{
                        fire
                            .firestore()
                            .collection('users')
                            .doc(profile.uid)
                            .update({
                                photoURL: url
                            });     // store photo URL to firebase firestore
                    });
            });
    }
    return (
        <div className="profile">
            <Breadcrumb address="Profile."/>
            <div className="profile_content">
                <div className="profile_content_item profile_content_photocontainer">
                    <img src={profile.photoURL}/>
                    <input
                        className="hidden_pic_input"
                        type="file"
                        id="file"
                        onChange={(e)=>{
                            updatePhotoURLToFirestore(e);
                        }}
                    />
                    <label for="file">
                        <EditIcon style={{fontSize: 20, color: grey[50]}}/>
                    </label>
                </div>
                <div className="profile_content_item">
                    <div className="profile_content_field">
                        <p className="profile_content_placeholder">UID:</p>
                        <p className="profile_content_fieldvalue">{profile.uid}</p>
                    </div>
                    <label>
                        <EditIcon style={{fontSize: 20, color: grey[700]}}/>
                    </label>
                </div>
                <div className="profile_content_item">
                    <div className="profile_content_field">
                        <p className="profile_content_placeholder">DISPLAY NAME:</p>
                        <p className="profile_content_fieldvalue">{profile.displayName}</p>
                    </div>
                    <label onClick={openDisplayNameInput}>
                        <EditIcon style={{fontSize: 20, color: grey[50]}}/>
                    </label>
                    <Dialog 
                        open={open} 
                        onClose={closeDisplayNameInput} 
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
                                Change Display Name
                            </p>
                        </DialogTitle>
                        <DialogContent>
                            <input
                                className="dialoginput"
                                type="text"
                                value={newDisplayName}
                                placeholder="New Display Name.."
                                onChange={(e)=>setNewDisplayName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={closeDisplayNameInput} color="primary">
                            <p className="dialogtitle2">
                                Cancel
                            </p>
                        </Button>
                        <Button onClick={()=>{
                            closeDisplayNameInput();
                            storeNewDisplayNameToFirestore();
                            setNewDisplayName('');
                        }} color="primary">
                            <p className="dialogtitle2">
                                Save
                            </p>
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div className="profile_content_item">
                    <div className="profile_content_field">
                        <p className="profile_content_placeholder">EMAIL:</p>
                        <p className="profile_content_fieldvalue">{profile.email}</p>
                    </div>
                    <label>
                        <EditIcon style={{fontSize: 20, color: grey[700]}}/>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Profile
