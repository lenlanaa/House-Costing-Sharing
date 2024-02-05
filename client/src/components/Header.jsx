import React from 'react';
import logonge from '../assets/logonge.png';

const Header = () => {
  return (
    <header className='py-6 mb-5 border-b ml-10 mr-10'>
      <div className='container mx-auto flex justify-between items-center'>
        <a href='/'><img src={logonge} alt='logo' /></a>
        <div className='flex items-center gap-6'>
          <a className='hover:text-yellow-500 text-white transition' href='/'>Home</a>
          <a className='hover:text-yellow-500 text-white transition' href='/about'>About Us</a>
          <a className='hover:text-yellow-500 text-white transition' href='/login'>Add new Property</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
