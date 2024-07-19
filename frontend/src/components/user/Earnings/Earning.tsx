import React, { useEffect } from 'react';
import UserProfileHeading from '@/components/common/UserProfileHeading';
import EarningTabs from './EarningTabs';
import AmountCards from './AmountCards';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { fetchWallet } from '@/Redux/Wallet';

const Earnings: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading, wallet, error } = useAppSelector((state) => state.wallet);

    useEffect(() => {
        dispatch(fetchWallet());
    }, [dispatch]);

    return (
        <div className="user-page-content">
            <UserProfileHeading title="Earnings & Payouts" />
            <AmountCards loading={loading} wallet={wallet} error={error} />
            <EarningTabs loading={loading} wallet={wallet} error={error} />
        </div>
    );
};

export default Earnings;
