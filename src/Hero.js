import React, {useState} from 'react'
import Header from './herocomponents/Header'
import './Hero.css'
import Profile from './herocomponents/heroscreens/Profile'
import Home from './herocomponents/heroscreens/Home'
import Chatroom from './herocomponents/heroscreens/Chatroom'

// chatroom id context
export const NavigateChatroomContext = React.createContext()

// navigate room context
export const NavigateHeroContext = React.createContext()

function Hero() {
    const [chatroomId, setChatroomId] = useState("uk4pOQjJW1VeB9NXjv9dbaQor242vsWRZbOW0Az5N1FY8ssHXJbRj1w4H2")
    const [heroScreen, setHeroScreen] = useState('home')
    return (
        <NavigateHeroContext.Provider value={setHeroScreen}>
            <NavigateChatroomContext.Provider value={setChatroomId}>
                <div className="hero">
                    <Header/>
                    {/* <Profile/> */}
                    {heroScreen==='home' &&
                        <Home/>
                    }
                    {heroScreen==='chatroom' &&
                        <Chatroom chatroomId={chatroomId}/>
                    }
                </div>
            </NavigateChatroomContext.Provider>
        </NavigateHeroContext.Provider>
    )
}

export default Hero
