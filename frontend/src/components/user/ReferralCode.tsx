import React from 'react';
import { useAppSelector } from "@/Redux/Hooks";
import SubHeadingComponent from '../common/Heading';

const ReferralCode: React.FC = () => {
  const {user} = useAppSelector((store) => store.auth);

  return (
    <div className="referral-code-container">
        <SubHeadingComponent title='Your Referral Code' />
      <div className="code-display">
        <p className="code">{user?.referralId}</p>
        <button className="button-full" onClick={() => navigator.clipboard.writeText(user ? user.referralId : "")}>Copy Code</button>
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
