import React from 'react'
import Header from './herocomponents/Header'
import './Hero.css'
import Profile from './herocomponents/heroscreens/Profile'

function Hero() {
    return (
        <div className="hero">
            <Header/>
            <Profile/>
        </div>
    )
}

export default Hero
