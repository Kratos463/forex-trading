import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faPiggyBank, faUser, faUserFriends, faUsers, faDollarSign } from '@fortawesome/free-solid-svg-icons';

interface CardProps {
  title: string;
  value: string;
  icon: any;
}

interface AmountCardsProps {
  loading: boolean;
  wallet: any;
  error: string | null;
}

const AmountCards: React.FC<AmountCardsProps> = ({ loading, wallet, error }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ROICard wallet={wallet} />
    </>
  );
};

interface WalletProps {
  wallet: any; // Define a more specific type based on your wallet structure
}

export const ROICard: React.FC<WalletProps> = ({ wallet }) => {
  const totalEarning = wallet?.selfRoi + wallet?.teamRoi + wallet?.directReferral;
  const roiData = [
    {
      title: "Total Self ROI",
      value: wallet?.selfRoi,
      icon: faUser
    },
    {
      title: "Total Team ROI",
      value: wallet?.teamRoi,
      icon: faUsers,
    },
    {
      title: "Total Direct Referral",
      value: wallet?.directReferral,
      icon: faUserFriends,
    },
  ];

  return (
    <div className='cardContainer'>
      {roiData.map((roi, index) => (
        <React.Fragment key={index}>
          <Card title={roi.title} value={`${roi?.value?.toFixed(2)} USDT`} icon={roi.icon} />
          {index < roiData.length - 1 ? <span style={{color: "white"}}> + </span> : <span style={{color: "white"}}> = </span>}
        </React.Fragment>
      ))}
      <Card title="Total Earning" value={`${totalEarning.toFixed(2)} USDT`} icon={faDollarSign} />
    </div>
  );

  
};

export const MainCard: React.FC<WalletProps> = ({ wallet }) => {
  const mainCardData = [
    { title: 'Main Wallet Balance', value: `${(wallet?.balance)?.toFixed(2)} USDT`, icon: faWallet },
    { title: 'Total Invested Amount', value: `${(wallet?.totalInvestment)?.toFixed(2)} USDT`, icon: faPiggyBank },
  ];

  return (
    <div className='cardContainer'>
      {mainCardData.map((data, index) => (
        <Card key={index} title={data.title} value={data.value} icon={data.icon} />
      ))}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="card">
      <div className="icon">
        <FontAwesomeIcon icon={icon} size="2x" />
      </div>
      <p>{value}</p>
      <h6>{title}</h6>
    </div>
  );
};

export default AmountCards;
