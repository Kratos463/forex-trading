import React from 'react';
import img from '../../../public/assests/images/about.png'

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
          <h2>Your next-generation fund manager powered by Artificial Intelligence </h2>
          <p>Wildforce Fund Management (WFM) is a UK-based investment management company established in October 2009. Renowned for their exceptional market analysts, WFM has consistently delivered significant returns to their clients, attracting major investors.</p>
          <p>In 2017, WFM embarked on developing an AI-powered fund management bot, recruiting specialists from various countries. After three years of rigorous development, testing began in late 2020. By January 2023, WFM started utilizing this bot in the forex and crypto markets, with results exceeding expectations. However, WFM requires a minimum investment of $10 million.</p>
          <p>To make their services accessible to a broader audience, WFM launched AIFXTRADER. With AIFXTRADER, anyone can start earning substantial profits by investing as little as $100, or any amount in multiples of $100. All funds are managed by WFM's advanced AI-powered fund manager bot.</p>
          <p>AIFXTRADER offers additional earning opportunities through its excellent referral program. You can earn direct referral commissions as well as a percentage from your team members' weekly returns</p>
        </div>
      </div>
    </div>
  );
};

export default About;
