import React from 'react';
import img1 from '../../../public/assests/images/Screenshot 2024-07-15 145945.png'
import img2 from '../../../public/assests/images/Screenshot 2024-07-15 150036.png'

const HowToProcess: React.FC = () => {
  return (
    <div className="how-to-process">
      <h3>How To Proceed</h3>
      <div className="steps">
        <div className="step">
          <img src={img1.src} alt="Step 1" />
          <div className="step-number">Step 1</div>
          <p>Just Go to add fund into main wallet in menu</p>
        </div>
        <div className="step">
          <img src={img2.src} alt="Step 2" />
          <div className="step-number">Step 2</div>
          <p>Then add amount on the given qr code or wallet address</p>
        </div>
        <div className="step">
          <img src={img2.src} alt="Step 3" />
          <div className="step-number">Step 3</div>
          <p>Then after deposit only press the i have depost button</p>
        </div>
        <div className="step">
          <img src={img2.src} alt="Step 4" />
          <div className="step-number">Step 4</div>
          <p>Description of Step 4</p>
        </div>
        <div className="step">
          <img src={img2.src} alt="Step 5" />
          <div className="step-number">Step 5</div>
          <p>Description of Step 5</p>
        </div>
        <div className="step">
          <img src={img2.src} alt="Step 6" />
          <div className="step-number">Step 6</div>
          <p>Description of Step 6</p>
        </div>
      </div>
    </div>
  );
};

export default HowToProcess;
