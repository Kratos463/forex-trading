import { sendVerificationCode } from '@/Redux/Auth';
import { useAppDispatch } from '@/Redux/Hooks';
import React from 'react';
import { toast } from 'react-toastify';

interface WelcomeMessageProps {
    user: string;
    isEmailVerified?: boolean;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user, isEmailVerified }) => {
    const dispatch = useAppDispatch();

    const handleResendVerification = () => {
        dispatch(sendVerificationCode());
        toast.success("Verification mail sent");
    };

    return (
        <div className='welcome-message-container'>
            <h2 className='welcome-message'>
                Welcome back, <span>{user}</span>
            </h2>
            {!isEmailVerified && (
                <div className='email-verify' >
                    <p>Please verify your email to access all features.</p>
                    <button
                        onClick={handleResendVerification}
                    >
                        Resend Verification Email
                    </button>
                </div>
            )}
        </div>
    );
};

export default WelcomeMessage;
