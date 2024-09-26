import React from 'react'
import {FaHandshake, FaArrowAltCircleRight} from 'react-icons/fa'
import '../App.css'

const Hero = () => {
  return (
    <div className='hero'>
      <div className='hero-left'>
        <h2>NEW ARRIVALS ONLY</h2>
        <div className='hand-icon'>
            <p>new</p>
            <img src='/img/hand.png'/>
        </div>
        <p>collections</p>
        <p>for everyone</p>
        <div className='hero-latest-btn'>
            <div>Latest Collection</div>
            <FaArrowAltCircleRight/>
        </div>
      </div>
      <di className='hero-right'>
        <img src='/img/hero.png'/>
      </di>
    </div>
  )
}

export default Hero
