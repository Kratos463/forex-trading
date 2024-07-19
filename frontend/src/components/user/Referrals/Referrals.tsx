import React, { useEffect } from 'react'
import UserProfileHeading from '@/components/common/UserProfileHeading'
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks'
import { fetchWallet } from '@/Redux/Wallet'
import ReferralsTabs from './ReferralsTabs'

const Referrals = () => {

  const dispatch = useAppDispatch();
    const { loading, wallet, error } = useAppSelector((state) => state.wallet);

    useEffect(() => {
        dispatch(fetchWallet());
    }, [dispatch]);

  return (
    <div className='user-page-content'>
      <UserProfileHeading title='Referrals' />
      <ReferralsTabs />
    </div>
  )
}

export default Referrals