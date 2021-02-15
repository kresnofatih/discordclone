import React from 'react'
import './Home.css'
import Friend from '../Friend'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { grey } from '@material-ui/core/colors'

function Home() {
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
            <div className="home_breadcrumbs">
                <h2>Home.</h2>
            </div>
            <div className="home_content">
                <div className="home_header">
                    <p>Start Chatting!</p>
                    <PersonAddIcon style={{fontSize: 27, color: grey[50]}}/>
                </div>
                {contacts.map(contact=>(
                    <Friend
                        displayName={contact.displayName}
                        photoURL={contact.photoURL}
                        email={contact.email}
                        status={contact.status}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
