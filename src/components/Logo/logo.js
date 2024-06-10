import React from 'react';
import Tilt from 'react-parallax-tilt';
import './logo.css';
import logo from '../../assests/logo.jpg';

const Logo = () => {
    return (
       <div className='ma4 mt0'>
         <Tilt className='Tilt'>
            <div className='Tilt-inner'>
                <img src={logo} alt='logo' className='logo' />
            </div>
          </Tilt>
       </div>
    );
}

export default Logo;

