import React from 'react';

interface CardProps {
  title: string;
  value: string;
  cardType: 'transparent' | 'colored';
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
      value: `${wallet?.selfRoi} USDT`
    },
    {
      title: "Total Team ROI",
      value: `${wallet?.teamRoi} USDT`,
    },
    {
      title: "Total Direct Referral",
      value: `${wallet?.directReferral} USDT`
    },
  ];

  return (
    <div className='cardContainer'>
      {roiData.map((roi, index) => (
        <React.Fragment key={index}>
          <Card title={roi.title} value={roi.value} cardType="colored" />
          {index < roiData.length - 1 ? <span> + </span> : <span> = </span>}
        </React.Fragment>
      ))}
      <Card title="Total Earning" value={`${totalEarning.toFixed(2)} USDT`} cardType="colored" />
    </div>
  );
};

export const MainCard: React.FC<WalletProps> = ({ wallet }) => {
  const mainCardData = [
    { title: 'Main Wallet Balance', value: `${wallet?.balance} USDT` },
    { title: 'Total Invested Amount', value: `${wallet?.totalInvestment} USDT` },
  ];

  return (
    <div className='cardContainer'>
      {mainCardData.map((data, index) => (
        <Card key={index} title={data.title} value={data.value} cardType="colored" />
      ))}
    </div>
  );
};

const Card: React.FC<CardProps> = ({ title, value, cardType }) => {
  const cardClass = cardType === 'transparent' ? 'transparentCard' : 'coloredCard';
  return (
    <>
      <div className={cardClass}>
        <h6>{title}</h6>
        <p>{value}</p>
      </div>
    </>
  );
};

export default AmountCards;
