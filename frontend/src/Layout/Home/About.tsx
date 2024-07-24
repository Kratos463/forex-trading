import React from 'react';
import img from '../../../public/assests/images/process.png'

const About: React.FC = () => {
  return (
    <div className='page-content'>
      <div className="about-section">
        <div className="image-container">
          <img src={img.src} alt="about" />
          <div className="neon-shadow"></div>
        </div>
        <div className="text-container">
          <p className='subheading'>WHAT IS AI FXTRADER</p>
          <h2>Your next-generation asset manager</h2>
          <p>You don’t need to have any previous trading experience to get going. choose our ready-made strategy that meets your timing and investment goals while minimizing risks with loss protection option. the interface is remarkably user friendly.</p>
          <p className='info'>Founded in 2016 and with offices in Russia, XPO endeavours to deliver innovative solutions to the investment management community at large. These range from spot to derivative trading solutions through index services and technology products. XPO expertise and technological prowess enable us to bring disruptive best-in-class solutions to the financial market.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
