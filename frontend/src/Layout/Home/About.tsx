import React from 'react';
import { Button } from 'reactstrap';
import { ImagePath } from '@/Constants';
import img from '../../../public/assests/images/about.png'

const About: React.FC = () => {
  return (
    <div className="about-section">
      <div className="image-container">
        <img  src={img.src} alt="about" />
        <div className="neon-shadow"></div>
      </div>
      <div className="text-container">
        <h1>Meet <span className="gold-text">Our Company </span>Unless Miss The Opportunity</h1>
        <p>Hey there! So glad you stopped by to Meet Our Company. Don't miss out on this opportunity to learn about what we do and the amazing team that makes it all happen! Our company is all about creating innovative solutions and providing top-notch services to our clients. From start to finish, we're dedicated to delivering results that exceed expectations.</p>
        <Button className="button-full">Explore More <i className="fas fa-arrow-right"></i></Button>
      </div>
    </div>
  );
};

export default About;
