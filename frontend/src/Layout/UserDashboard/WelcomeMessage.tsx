import React from 'react';

interface WelcomeMessageProps {
    user: string;
    isEmailVerified?: boolean;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ user, isEmailVerified }) => {
    const handleResendVerification = () => {
        // Implement resend email logic here
        alert('Resend verification email functionality');
    };

    return (
        <div className='welcome-message-container'>
            <h2 className='welcome-message'>
                Welcome back, <span>{user}</span>!
            </h2>
            {!isEmailVerified && (
                <div className='email-verify'>
                    <p>Please verify your email</p>
                    <button onClick={handleResendVerification}>Click here to resend verification mail</button>
                </div>
            )}
        </div>
    );
};

export default WelcomeMessage;
