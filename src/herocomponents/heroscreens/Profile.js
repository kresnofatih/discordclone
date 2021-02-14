import React, {useContext} from 'react'
import './Profile.css'
import { ProfileContext } from '../../App'
import EditIcon from '@material-ui/icons/Edit'
import { grey } from '@material-ui/core/colors'
import fire from '../../Fire'

function Profile() {
    const profile = useContext(ProfileContext)
    return (
        <div className="profile">
            <div className="profile_breadcrumbs">
                <h2>Profile.</h2>
            </div>
            <div className="profile_content">
                <div className="profile_content_item profile_content_photocontainer">
                    <img src={profile.photoURL}/>
                    <input
                        className="hidden_pic_input"
                        type="file"
                        id="file"
                        onChange={(e)=>{
                            const file = e.target.files[0];
                            const storageRef = fire.storage().ref();
                            const d = new Date();
                            const fileRef = storageRef.child('users/photoURL/'+profile.uid+'/'+d.toLocaleString().replace("/", "_").replace("/", "_").replace(" ", "_"));
                            fileRef
                                .put(file)
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
                                                });
                                        });
                                });
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
                    <EditIcon style={{fontSize: 20, color: grey[50]}}/>
                </div>
                <div className="profile_content_item">
                    <div className="profile_content_field">
                        <p className="profile_content_placeholder">DISPLAY NAME:</p>
                        <p className="profile_content_fieldvalue">{profile.displayName}</p>
                    </div>
                    <EditIcon style={{fontSize: 20, color: grey[50]}}/>
                </div>
                <div className="profile_content_item">
                    <div className="profile_content_field">
                        <p className="profile_content_placeholder">EMAIL:</p>
                        <p className="profile_content_fieldvalue">{profile.email}</p>
                    </div>
                    <EditIcon style={{fontSize: 20, color: grey[50]}}/>
                </div>
            </div>
        </div>
    )
}

export default Profile
