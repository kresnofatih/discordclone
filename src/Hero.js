import React, {useEffect} from 'react'
import Header from './herocomponents/Header'
import './Hero.css'
import Profile from './herocomponents/heroscreens/Profile'
import Home from './herocomponents/heroscreens/Home'

function Hero() {
    return (
        <div className="hero">
            <Header/>
            {/* <Profile/> */}
            <Home/>
        </div>
    )
}

export default Hero
