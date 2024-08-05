import React from 'react';
import SubHeadingComponent from '@/components/common/Heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faDollarSign, faUsers, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import ParticlesComponent from '@/components/common/Particles';

const WhyChooseUs = () => {
  const usps = [
    {
      title: "High Reliability",
      description: "Our extensive experience in the industry makes us a reliable choice, already trusted by thousands of large capital investors.",
      icon: faShieldAlt,
    },
    {
      title: "Transparent Returns",
      description: "At AIFXTRADER, every investor is valued equally, whether they start with $100 or $100,000. Everyone receives the same percentage of returns on their invested funds.",
      icon: faDollarSign,
    },
    {
      title: "More Earning with Referral Program",
      description: "You can earn even more by referring others to this platform and sharing this fantastic opportunity with them.",
      icon: faUsers,
    },
    {
      title: "Hassle-Free Withdrawal",
      description: "The withdrawal process here is straightforward: you'll receive your funds within 7 days of your request. This timeframe is necessary because the funds are actively invested in the market and need to be moved out before releasing withdrawals.",
      icon: faHandHoldingUsd,
    },
  ];

  return (
    <div className="why-choose-us-section">
      {/* <ParticlesComponent /> */}
      <div className='page-content'>
        <SubHeadingComponent title='Why Choose Us?' subtitle='Reliable, Transparent & Multiple Earning Options' />
        <div className="content">
          {usps.map((usp, index) => (
            <div key={index} className="card">
              <div className="icon-container">
                <div className="icon">
                  <FontAwesomeIcon icon={usp.icon} />
                </div>
              </div>
              <div className="text">
                <h4 className="title">{usp.title}</h4>
                <p className="description">{usp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
