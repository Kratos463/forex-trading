import React, { useState } from 'react';
import { useAppSelector } from "@/Redux/Hooks";
import SubHeadingComponent from '../common/Heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const ReferralCode: React.FC = () => {
  const {user} = useAppSelector((store) => store.auth);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user ? user.referralId : "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };


  return (
    <div className="referral-code-container">
        <SubHeadingComponent title='Your Referral Code' />
      <div className="code-display">
        <p className="code">{user?.referralId}</p>
        <button onClick={handleCopy} className='button-full'>
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? 'Copied' : 'Copy'}
            </button>
      </div>
      <div className="advantages">
        <h3>Advantages of Referring Friends</h3>
        <ul>
          <li>Earn up to 10% commission on your friend's investments.</li>
          <li>Help your friends get started with easy investment plans.</li>
          <li>Earn up to 15% commission on team investment.</li>
          <li>Gain access to exclusive promotions and rewards.</li>
          <li>Expand your network and grow your earning potential.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralCode;
