import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './icons8-brain-64.png'
import './logo.css'

const Logo = () => {
	return(
		<div className='ma4 mt0'>
			<Tilt className='tilt br2 shadow-2' style={{width: '100px'}}>
      <div className='pa3'style={{ height: '100px'}}>
        <img style={{paddingTop: '5px'}} alt='logo' src={brain}/>
      </div>
    </Tilt>
		</div>
		)
}


export default Logo;