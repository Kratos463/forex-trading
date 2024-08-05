import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import image1 from '../../../public/assests/images/referral-link.png'

interface referralInterface{
    code: any
}

const ReferralLink: React.FC<referralInterface> = ({code}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/auth/register?referralCode=${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return ( 
    <div className="referral-link-container">
      <div className="referral-card">
        <div className="icon">
         <Image src={image1.src} alt="Referral-image" width={2000} height={2000} />
        </div>
        <div className="details">
          <h3>Referral Link</h3>
          <p>Share this link with your friends to invite them and earn rewards.</p>
          <div className="link">
            <span>{`http://localhost:3000/auth/register?referralCode=${code}`}</span>
            <button onClick={handleCopy}>
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLink;
