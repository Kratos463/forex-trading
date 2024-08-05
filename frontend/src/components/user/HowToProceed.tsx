import React from 'react';
import SubHeadingComponent from '../common/Heading';

const steps = [
  { stepNumber: 'Step 1', description: 'Just Go to add fund into main wallet in menu' },
  { stepNumber: 'Step 2', description: 'Then add amount on the given QR code or wallet address' },
  { stepNumber: 'Step 3', description: 'Then after deposit only press the "I have deposited" button' },
  { stepNumber: 'Step 4', description: 'Description of Step 4' },
  { stepNumber: 'Step 5', description: 'Description of Step 5' },
  { stepNumber: 'Step 6', description: 'Description of Step 6' },
];

const HowToProcess: React.FC = () => {
  return (
    <div className="how-to-process">
      <SubHeadingComponent
                    
                    title="How to Add Funds and Invest"
                    description='Follow these simple steps to seamlessly add funds to your main wallet and start investing.'
                />
      <div className="timeline">

        <div className="timeline__event  animated fadeInUp delay-3s timeline__event--type1">
          <div className="timeline__event__icon ">1
          </div>
          <div className="timeline__event__content ">
            <div className="timeline__event__title">
              Add Funds to Main Wallet
            </div>
            <div className="timeline__event__description">
              <p> Go to the main menu and click on "Add Fund To Main Wallet" in the main wallet.</p>
            </div>
          </div>
        </div>



        <div className="timeline__event animated fadeInUp delay-2s timeline__event--type2">
          <div className="timeline__event__icon">2
          </div>
          <div className="timeline__event__content">
            <div className="timeline__event__title">
              Scan QR Code or Copy Address
            </div>
            <div className="timeline__event__description">
              <p>Scan the QR code or copy the wallet address, then add the desired amount to the given QR code or wallet address.</p>
            </div>
          </div>
        </div>



        <div className="timeline__event animated fadeInUp delay-1s timeline__event--type3">
          <div className="timeline__event__icon"> 3</div>
          <div className="timeline__event__content">
            <div className="timeline__event__title">
              Confirm Deposit
            </div>
            <div className="timeline__event__description">
              <p>After 60 seconds, press the "I have deposited" button to confirm the amount in the main wallet.</p>
            </div>

          </div>
        </div>



        <div className="timeline__event animated fadeInUp timeline__event--type1">
          <div className="timeline__event__icon">4
          </div>
          <div className="timeline__event__content">
            <div className="timeline__event__title">
              Navigate to Invest Menu
            </div>
            <div className="timeline__event__description">
              <p> Go to the "Invest to Earn" menu.</p>
            </div>
          </div>
        </div>

        <div className="timeline__event  animated fadeInUp delay-3s timeline__event--type2">
          <div className="timeline__event__icon ">5
          </div>
          <div className="timeline__event__content ">
            <div className="timeline__event__title">
              Enter Investment Amount
            </div>
            <div className="timeline__event__description">
              <p> Enter the amount (minimum 100 USDT) for investment and press the submit button.</p>
            </div>
          </div>
        </div>

        <div className="timeline__event animated fadeInUp delay-2s timeline__event--type3">
          <div className="timeline__event__icon">6
          </div>
          <div className="timeline__event__content">
            <div className="timeline__event__title">
              Investment Confirmation
            </div>
            <div className="timeline__event__description">
              <p>Congratulations! You've invested. Sit back and relax as your weekly income starts without any hard work.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToProcess;
