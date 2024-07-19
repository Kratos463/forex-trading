import React, { useEffect } from 'react'
import UserProfileHeading from '@/components/common/UserProfileHeading'
import WithdrawalTabs from './WithdrawalTab'
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks'
import { fetchWallet } from '@/Redux/Wallet'

const Withdrawal = () => {
  const dispatch = useAppDispatch()
  const { wallet } = useAppSelector((state) => state.wallet)

  useEffect(() => {
    dispatch(fetchWallet())
  }, [dispatch]);

  return (
    <div className='user-page-content'>
      <UserProfileHeading title='Withdrawals' />
      <WithdrawalTabs wallet={wallet} />
    </div>
  )
}

export default Withdrawal