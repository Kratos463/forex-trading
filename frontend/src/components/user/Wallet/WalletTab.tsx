import React from 'react';
import DynamicTabs from '@/components/common/Tabs';
import AddFund from './AddFund';
import WalletTransactions from './WalletTransactions';


interface WalletTabsProps {
    loading: boolean;
    wallet: any;
    error: string | null;
}

const WalletTabs: React.FC<WalletTabsProps> = ({ wallet, loading, error }) => {
    const tabs = [
        {
            id: 1,
            title: 'Add Fund',
            content: <AddFund wallet={wallet}/>
        },
        {
            id: 2,
            title: 'Transactions',
            content: <WalletTransactions transactions={wallet?.transactions} />
        },
    ];

    return (
        <div className="app">
            <DynamicTabs tabs={tabs} />
        </div>
    );
};

export default WalletTabs;
