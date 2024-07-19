import SubHeadingComponent from '@/components/common/Heading';
import React from 'react';

const WhyChooseUs = () => {
  const usps = [
    {
      title: "Secure and Reliable",
      description: "Ensure secure transactions and data protection with built-in security measures like two-factor authentication.",
      icon: "🔒", // Replace with actual icon component
    },
    {
      title: "Transparent Returns",
      description: "Guaranteed weekly returns on investments with clear tracking.",
      icon: "📈", // Replace with actual icon component
    },
    {
      title: "Expert Support",
      description: "Dedicated customer support for assistance and educational resources for users to learn and grow.",
      icon: "🧑‍🏫", // Replace with actual icon component
    },
  ];

  return (
    <div className="why-choose-us-section">
      <SubHeadingComponent title='Why Choose Us' subtitle='Unlock the Potential of Secure and Transparent Investing' />
      <div className="content">
        {usps.map((usp, index) => (
          <div key={index} className={`item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="icon">{usp.icon}</div>
            <div className="text">
              <h3 className="subtitle">{usp.title}</h3>
              <p className="description">{usp.description}</p>
            </div>
          </div>
        ))}
        <div className="timeline"></div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
