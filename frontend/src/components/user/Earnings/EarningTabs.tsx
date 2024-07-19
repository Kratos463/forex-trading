import React from 'react';
import DynamicTabs from '@/components/common/Tabs';
import TeamROI from './TeamROI';
import SelfROI from './SelfROI';
import DirectReferral from './DirectReferral';

interface EarningTabsProps {
    loading: boolean;
    wallet: any;
    error: string | null;
}

const EarningTabs: React.FC<EarningTabsProps> = ({ loading, wallet, error }) => {
    const tabs = [
        {
            id: 2,
            title: 'Team ROI',
            content: <TeamROI transactions={wallet?.transactions}/>,
        },
        {
            id: 3,
            title: 'Self ROI',
            content: <SelfROI transactions={wallet?.transactions}/>,
        },
        {
            id: 4,
            title: 'Direct Referral',
            content: <DirectReferral transactions={wallet?.transactions}/>,
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="app">
            <DynamicTabs tabs={tabs} />
        </div>
    );
};

export default EarningTabs;
