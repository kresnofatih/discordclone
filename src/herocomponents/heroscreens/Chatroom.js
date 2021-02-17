import React from 'react'
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

function Chatroom() {
    return (
        <div className="chatroom">
            <Breadcrumb address="Chatroom."/>
            <div className="chatroom_content">
                <div className="chatroom_header">
                    <div className="chatroom_headersides">
                        <CodeIcon style={{fontSize: 27, color: grey[50]}}/>
                        &nbsp;
                        &nbsp;
                        <p className="chatroom_name">bacotan</p>
                    </div>
                    <div className="chatroom_headersides">
                        <GroupAddIcon style={{fontSize: 27, color: grey[50]}}/>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <GroupIcon style={{fontSize: 27, color: grey[50]}}/>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <PersonIcon style={{fontSize: 27, color: grey[50]}}/>
                    </div>
                </div>
                <div className="chatroom_chatlog">
                    <p>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    test<br></br>
                    </p>
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
