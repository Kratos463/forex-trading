import Link from 'next/link';
import React from 'react';
import { Button } from 'reactstrap';

const Hero = () => {
  return (
    <div className="hero">
      <div className="text-container">
        <h1>The World's most innovative platform for <span className='gold-text'>FOREX</span> and <span className='gold-text'>CRYPTOCURRENCY</span></h1>
        <p className="subheading">Secure investments, lucrative referral rewards, and transparent earnings</p>
        <Link href="/auth/register"> <Button className="button-full">Get Started <i className="fas fa-arrow-right"></i></Button></Link>
      </div>
    </div>
  );
};

export default Hero;
