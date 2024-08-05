import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { addFundToWallet, fetchWallet } from '@/Redux/Wallet';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

interface Wallet {
  balance: number;
  walletAddress: string;
  walletQrCode: string;
}

interface AddFundProps {
  wallet: Wallet;
}

const AddFund: React.FC<AddFundProps> = ({ wallet }) => {
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.wallet);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet?.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handleAddFund = async () => {
    try {
      const resultAction = await dispatch(addFundToWallet());
      if (addFundToWallet.fulfilled.match(resultAction)) {
        toast.success("Amount added into wallet");
        dispatch(fetchWallet());
      } else {
        toast.error("Insufficient balance. Please try again.");
      }
    } catch (error) {
      toast.error('Failed to deposit funds. Please try again.');
      console.error('Error in handleAddFund:', error);
    }
  };



  return (
    <div className="add-fund-container">
      <div className="add-fund-content">
        <h6>
          Available Balance: <span>{wallet?.balance?.toFixed(2)} USDT</span>
        </h6>

        <div className="add-fund-form">
          <div className="link">
            <span>Address: {wallet?.walletAddress} </span>
            <button onClick={handleCopy}>
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="qr-code-section">
            <div className="qr-code">
              <img src={wallet?.walletQrCode} alt="Wallet QR Code" />
            </div>
          </div>
          <p style={{ color: "red" }}>Please press the button after 60sec <br /> to transfer the amount into main wallet</p>
          <div className="button-section">
            <button className="button-full" onClick={handleAddFund} disabled={loading}>
              {loading ? 'Adding Funds...' : 'I have deposited'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFund;
