import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { addFundToWallet, fetchWallet } from '@/Redux/Wallet';
import React from 'react';
import { toast } from 'react-toastify';

interface Wallet {
  balance: number;
  walletAddress: string;
  walletQrCode: string;
}

interface AddFundProps {
  wallet: Wallet;
}

const AddFund: React.FC<AddFundProps> = ({ wallet }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.wallet);

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(wallet?.walletAddress);
    toast.success('Wallet address copied!');
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
          <div className="wallet-section">
            <div className="wallet-address">
              <label>Address: {wallet?.walletAddress} </label>
              <button className="copy-button" onClick={copyWalletAddress}>
                <i className="fa-solid fa-copy"></i>
              </button>
            </div>
          </div>
          <div className="qr-code-section">
            <div className="qr-code">
              <img src={wallet?.walletQrCode} alt="Wallet QR Code" />
            </div>
          </div>
          <p style={{ color: "red" }}>Please press the button after 2 minutes <br /> to transfer it to the transfer the amount.</p>
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
