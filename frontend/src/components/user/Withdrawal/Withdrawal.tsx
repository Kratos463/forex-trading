import React, { useEffect } from 'react'
import UserProfileHeading from '@/components/common/UserProfileHeading'
import WithdrawalTabs from './WithdrawalTab'
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks'
import { fetchWallet } from '@/Redux/Wallet'
import { sendVerificationCode } from '@/Redux/Auth'
import { toast } from 'react-toastify'

const Withdrawal = () => {
  const dispatch = useAppDispatch()
  const { wallet } = useAppSelector((state) => state.wallet)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchWallet())
  }, [dispatch]);

  const handleResendVerification = () => {
    dispatch(sendVerificationCode())
    toast.success("Verification mail send")
  };


  return (
    <div className='user-page-content'>
      <UserProfileHeading title='Withdrawals' />

      {
        user?.isEmailVerified ? (
          <WithdrawalTabs wallet={wallet} />
        ) : (
          <div className='email-verify' style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#ff4d4f', fontWeight: 'bold', textAlign: "center" }}>
              Your email is not verified. Please verify your email to proceed with withdrawals.
            </p>
            <button
              onClick={handleResendVerification}
              style={{
                backgroundColor: '#ff4d4f',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Resend Verification Email
            </button>
          </div>
        )
      }
    </div>

  )
}

export default Withdrawal