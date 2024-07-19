import React from 'react';
import DynamicTabs from '@/components/common/Tabs';
import NewWithdawal from './NewWithdawal';
import WithdrawalList from './WithdrawalList';


interface WithdrawalTabsProps{
    wallet: any
}

const WithdrawalTabs: React.FC<WithdrawalTabsProps> = ({wallet}) => {
    const tabs = [
        {
            id: 1,
            title: 'New Withdrawal',
            content: <NewWithdawal wallet={wallet?.balance} />, // Component for Tab 1
        },
        {
            id: 2,
            title: 'Transactions',
            content: <WithdrawalList />
        },
    ];

    return (
        <div className="app">
            <DynamicTabs tabs={tabs} />
        </div>
    );
};

export default WithdrawalTabs;
