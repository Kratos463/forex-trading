import React from 'react';
import ParticlesComponent from '@/components/common/Particles';
import Link from 'next/link';
import { Button } from 'reactstrap';

const Hero = () => {
  return (
    <div className="hero">
      {/* <ParticlesComponent /> */}
      <div className="text-container">
        <h1>
          The World's Leading AI-Powered Platform For <span className='gold-text'>Innovative</span> And Secure <span className='gold-text'>Fund Management</span>
        </h1>
        <p className="subheading">
          Are you tired of losing money in the forex and crypto markets? Invest your funds with AIFXTRADER and enjoy consistent weekly profits. All you need to do is relax and spend quality time with your loved ones.
        </p>
        <Link href="/auth/register">
          <Button className="button-full">Get Started <i className="fas fa-arrow-right"></i></Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
