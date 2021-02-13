import React from 'react'
import './Entry.css'
import discordlogo from './DiscordWhite.png'

function Entry({login}) {
    return (
        <div className="entry">
            <img src={discordlogo}/>
            <div className="entry_box">
                <h1>Welcome back!</h1>
                <h2>We're so excited to see you again!</h2>
                <button onClick={()=>{
                    login();
                }}>login</button>
            </div>
        </div>
    )
}

export default Entry
