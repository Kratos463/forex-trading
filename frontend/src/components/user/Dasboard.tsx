import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import WelcomeMessage from '@/Layout/UserDashboard/WelcomeMessage';
import { fetchWallet } from '@/Redux/Wallet';
import AmountCards, { MainCard, ROICard } from './Earnings/AmountCards';
import PromotionSlider from '@/Layout/UserDashboard/PromotionSlider';
import DirectReferrals from '@/Layout/UserDashboard/DirectReferrals';
import SubHeadingComponent from '../common/Heading';
import { fetchUser } from '@/Redux/Auth';
import HowToProcess from './HowToProceed';

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, referrals } = useAppSelector((store) => store.auth);
    const { loading, wallet, error } = useAppSelector((state) => state.wallet);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchUser());
                await dispatch(fetchWallet());
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., show error message)
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div className='user-page-wrapper'>
            <div className='page-content'>
                <PromotionSlider />
                <WelcomeMessage user={user?.username || "Investor"} isEmailVerified={user?.isEmailVerified} />
                <MainCard wallet={wallet} />
                <div style={{ marginTop: "50px" }}>
                    <h3>Earning Till Now</h3>
                    <ROICard wallet={wallet} />
                </div>
                <HowToProcess />
                <DirectReferrals />
            </div>
        </div>
    );
};

export default Dashboard;
