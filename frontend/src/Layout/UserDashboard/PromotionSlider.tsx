import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { getPromotions } from '@/Redux/Promotions';
import ShimmerEffect from '@/components/common/shimmer';


const PromotionSlider: React.FC = () => {
  const dispatch = useAppDispatch();
  const { promotions, isLoading } = useAppSelector((state) => state.promotion);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getPromotions());
  }, [dispatch]);

  useEffect(() => {
    if (promotions.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [promotions]);

  const currentPromotion = promotions[currentIndex] || { image: { src: '/default.jpg' }, title: 'Default Title' };
  const { image, title } = currentPromotion;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (promotions.length > 0 ? (prevIndex === 0 ? promotions.length - 1 : prevIndex - 1) : 0));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (promotions.length > 0 ? (prevIndex + 1) % promotions.length : 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className='promotion-slider-container'>
      {isLoading ? (
        <ShimmerEffect />
      ) : (
        <div className="promotion-slider" style={{ backgroundImage: `url(${image})` }}>
          <div className="promotion-content">
            <h2>{title}</h2>
          </div>
          <div className="arrow left" onClick={goToPrevious}>
            &#10094;
          </div>
          <div className="arrow right" onClick={goToNext}>
            &#10095;
          </div>
          <div className="dots">
            {promotions.map((promotion, index) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionSlider;
