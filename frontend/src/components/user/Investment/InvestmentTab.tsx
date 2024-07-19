import React from 'react';
import DynamicTabs from '@/components/common/Tabs';
import NewInvestment from './NewInvestment';
import InvestmentList from './InvestmentList';

interface InvestmentTabsProps {
    loading: boolean;
    investments: any;
    error: string | null;
    wallet: any
}

const InvestmentTabs: React.FC<InvestmentTabsProps> = ({ investments, loading, error, wallet }) => {
    const tabs = [
        {
            id: 1,
            title: 'New Inverstment',
            content: <NewInvestment wallet={wallet?.balance}/>, // Component for Tab 1
        },
        {
            id: 2,
            title: 'Investments',
            content: <InvestmentList loading={loading} investments={investments} error={error} />, // Component for Tab 2
        },
    ];

    return (
        <div className="app">
            <DynamicTabs tabs={tabs} />
        </div>
    );
};

export default InvestmentTabs;
