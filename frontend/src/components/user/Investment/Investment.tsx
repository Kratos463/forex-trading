import React, { useEffect } from 'react'
import UserProfileHeading from '@/components/common/UserProfileHeading'
import InvestmentTabs from './InvestmentTab'
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks'
import { fetchInvestments } from '@/Redux/Investment'
import { fetchWallet } from '@/Redux/Wallet'

const Investment = () => {

  const dispatch = useAppDispatch()
  const { loading, investments, error } = useAppSelector((state) => state.investment)
  const {wallet} = useAppSelector((state)=> state.wallet)

  useEffect(() => {
    dispatch(fetchWallet())
    dispatch(fetchInvestments());
}, [dispatch]);

  return (
    <div className='user-page-content'>
      <UserProfileHeading title='Investment' />
      <InvestmentTabs loading={loading} investments={investments} error={error} wallet={wallet}/>
    </div>
  )
}

export default Investment