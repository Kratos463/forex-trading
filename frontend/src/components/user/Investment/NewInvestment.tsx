import { useAppDispatch } from '@/Redux/Hooks';
import { fetchInvestments, makeInvestment } from '@/Redux/Investment';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface NewInvestmentProps {
  wallet: number;
}

const NewInvestment: React.FC<NewInvestmentProps> = ({ wallet }) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (wallet < 100) {
      setErrorMessage('Insufficient balance. You need at least 100 USDT to invest.');
      return;
    } else if (amount < 100) {
      setErrorMessage('Please enter an amount greater than or equal to 100 USDT.');
      return;
    } else if (amount % 100 !== 0) {
      setErrorMessage('Please enter an amount that is a multiple of 100 USDT.');
      return;
    } else if (amount > wallet) {
      setErrorMessage('Entered amount exceeds available balance.');
      return;
    }

    setErrorMessage('');

    try {
      const resultAction = await dispatch(makeInvestment({ amount }));
      if (makeInvestment.fulfilled.match(resultAction)) {
        setAmount(0)
        dispatch(fetchInvestments())
        toast.success("Investment successful!");
      } else {
        toast.error("Failed to make an investment. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className='add-fund-container'>
      <div className='add-fund-content'>
        <h6>Available Balance: <span>{wallet?.toFixed(2)} USDT</span></h6>
        <p>Invest a minimum of 100 USDT, or any multiple of 100 USDT, <br /> to grow your portfolio.</p>
        <form className='form-normal' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Amount</label>
            <input
              name="amount"
              onChange={handleAmountChange}
              className='form-control'
              type="number"
              placeholder='Enter amount'
              min="0"
            />
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button type="submit" className='button-full'>Make Investment</button>
        </form>
      </div>
    </div>
  );
};

export default NewInvestment;
