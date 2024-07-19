import React, { useEffect } from 'react'
import UserProfileHeading from '@/components/common/UserProfileHeading'
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks'
import WalletTabs from './WalletTab'
import { fetchWallet } from '@/Redux/Wallet'

const Wallet = () => {

  const dispatch = useAppDispatch();
    const { loading, wallet, error } = useAppSelector((state) => state.wallet);

    useEffect(() => {
        dispatch(fetchWallet());
    }, [dispatch]);

  return (
    <div className='user-page-content'>
      <UserProfileHeading title='Wallet' />
      <WalletTabs loading={loading} wallet={wallet} error={error} />
    </div>
  )
}

export default Wallet