import { useAppDispatch } from '@/Redux/Hooks';
import { withdrawalRequest } from '@/Redux/Wallet';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface NewWithdawalProps {
  wallet: number;
}

const NewWithdawal: React.FC<NewWithdawalProps> = ({ wallet }) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
    if (e.target.value) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (wallet < 100) {
      setErrorMessage('Insufficient balance. You need at least 100 USDT to withdraw.');
      return;
    } else if (amount < 50) {
      setErrorMessage('Please enter an amount greater than or equal to 50 USDT.');
      return;
    } else if (amount > wallet) {
      setErrorMessage('Entered amount exceeds available balance.');
      return;
    } else if (!walletAddress) {
      setErrorMessage('Please enter a valid wallet address.');
      return;
    }

    setErrorMessage('');

    try {
      const resultAction = await dispatch(withdrawalRequest({ amount, walletAddress }));
      if (withdrawalRequest.fulfilled.match(resultAction)) {
        setAmount(0);
        setWalletAddress('');
        toast.success('Withdrawal request successful!');
      } else {
        toast.error('Failed to make a withdrawal request. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className='add-fund-container'>
      <div className='add-fund-content'>
        <h6>Available Balance: <span>{wallet?.toFixed(2)} USDT</span></h6>
        <p>Withdrawal a minimum of 50 USDT</p>
        <form className='form-normal' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Amount</label>
            <input
              className='form-control'
              type="text"
              placeholder='Enter amount'
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          <div className='form-group'>
            <label>Wallet Address</label>
            <input
              className='form-control'
              type="text"
              placeholder='Enter wallet address'
              value={walletAddress}
              onChange={handleWalletAddressChange}
            />
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button className='button-full' type="submit">Withdraw</button>
        </form>
      </div>
    </div>
  );
};

export default NewWithdawal;
