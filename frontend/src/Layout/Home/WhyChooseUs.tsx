import SubHeadingComponent from '@/components/common/Heading';
import React from 'react';

const WhyChooseUs = () => {
  const usps = [
    {
      title: "Legal Company",
      description: "Our company conducts absolutely legal activities in the legal field. We are certified to operate investment business, we are legal and safe.",
      icon: "🔒", // Replace with actual icon component
    },
    {
      title: "High reliability",
      description: "We are trusted by a huge number of people. We are working hard constantly to improve the level of our security system and minimize possible risks.",
      icon: "🔒", // Replace with actual icon component
    },
    {
      title: "Anonymity",
      description: "Ensure secure transactions and data protection with built-in security measures like two-factor authentication.",
      icon: "🔒", // Replace with actual icon component
    },
    {
      title: "Transparent Returns",
      description: "Guaranteed weekly returns on investments with clear tracking.",
      icon: "📈", // Replace with actual icon component
    },
    {
      title: "Referral Program",
      description: "We are offering a certain level of referral income through our referral program. you can increase your income by simply refer a few people.",
      icon: "🔒", // Replace with actual icon component
    },
    {
      title: "Quick Withdrawal",
      description: "Our all retreats are treated spontaneously once requested. There are high maximum limits. The minimum withdrawal amount is only $50.",
      icon: "🧑", // Replace with actual icon component
    },
    {
      title: "Expert Support",
      description: "Dedicated customer support for assistance and educational resources for users to learn and grow.",
      icon: "🧑", // Replace with actual icon component
    },
  ];

  return (
    <div className="why-choose-us-section">
      <div className='page-content'>
        <SubHeadingComponent title='Why Choose Us' subtitle='Unlock the Potential of Secure and Transparent Investing' />
        <div className="content">
          {usps.map((usp, index) => (
            <div key={index} className={`item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="icon">{usp.icon}</div>
              <div className="text">
                <h4 className="subtitle">{usp.title}</h4>
                <p className="description">{usp.description}</p>
              </div>
            </div>
          ))}
          <div className="timeline"></div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
