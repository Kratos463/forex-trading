import React from 'react';
import { Button } from 'reactstrap';

const Hero = () => {
  return (
    <div className="hero">
      <div className="text-container">
        <h1>Empower Your <br /> <span className="gold-text">Financial Future</span></h1>
        <p className="subheading">Secure investments, lucrative referral rewards, <br /> and transparent earnings</p>
      </div>
      <Button className="button-full">Get Started <i className="fas fa-arrow-right"></i></Button>
    </div>
  );
};

export default Hero;
