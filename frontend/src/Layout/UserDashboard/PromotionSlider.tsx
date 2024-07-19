import React, { useState, useEffect } from 'react';
import img1 from '../../../public/assests/images/car.jpeg';
import img2 from '../../../public/assests/images/mylasia.jpeg';
import img3 from '../../../public/assests/images/laptop.jpeg';

interface Slide {
  backgroundImage: any;
  message: string;
}

const slides: Slide[] = [
  {
    backgroundImage: img3,
    message: 'Make a total investment of 50k and get a chance to win a laptop!',
  },
  {
    backgroundImage: img1,
    message: 'Make a total investment of 50k and get a chance to win a car!',
  },
  {
    backgroundImage: img2,
    message: 'Make a total investment of 50k and get a chance to go to Malaysia!',
  },
  // Add more slides as needed
];

const PromotionSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const { backgroundImage, message } = slides[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
  <div className='promotion-slider-container'>
      <div className="promotion-slider" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
      <div className="promotion-content">
        <h2>{message}</h2>
      </div>
      <div className="arrow left" onClick={goToPrevious}>
        &#10094;
      </div>
      <div className="arrow right" onClick={goToNext}>
        &#10095;
      </div>
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  </div>
  );
};

export default PromotionSlider;
