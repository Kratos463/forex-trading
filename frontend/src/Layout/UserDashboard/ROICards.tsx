import React from 'react';
import walletImg from '../../../public/assests/images/wallet.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUser, faUserFriends, faUsers } from '@fortawesome/free-solid-svg-icons';

interface AmountCardsProps {
    loading: boolean;
    wallet: any;
    error: string | null;
}

const Commission: React.FC<AmountCardsProps> = ({ loading, wallet, error }) => {
    const totalEarning = (wallet?.selfRoi || 0) + (wallet?.directReferral || 0) + (wallet?.teamRoi || 0);

    return (
        <div className='referral-link-section'>
            <div className='image'>
                <Image src={walletImg.src} alt="wallet" width={150} height={150} />
            </div>
            <div className='details'>
                <h3>Total Earning Till Now</h3>
                <p>Rewards earned by self, direct and team ROI.</p>
                <div className="container">
                    <div className="card">
                        <div className="icon">
                            <FontAwesomeIcon icon={faUser} size="2x" color="#4A90E2" />
                        </div>
                        <div className="info">
                            <h3>{(wallet?.selfRoi)?.toFixed(2) || '0.00'} USDT</h3>
                            <p>Total Self ROI</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="icon">
                            <FontAwesomeIcon icon={faUserFriends} size="2x" color="#50E3C2" />
                        </div>
                        <div className="info">
                            <h3>{(wallet?.directReferral)?.toFixed(2) || '0.00'} USDT</h3>
                            <p>Total Direct Referral</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="icon">
                            <FontAwesomeIcon icon={faUsers} size="2x" color="#E94E77" />
                        </div>
                        <div className="info">
                            <h3>{(wallet?.teamRoi)?.toFixed(2) || '0.00'} USDT</h3>
                            <p>Total Team ROI</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="icon">
                            <FontAwesomeIcon icon={faDollarSign} size="2x" color="#FFD700" />
                        </div>
                        <div className="info">
                            <h3>{(totalEarning).toFixed(2) || '0.00'} USDT</h3>
                            <p>Total Earning</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Commission;
