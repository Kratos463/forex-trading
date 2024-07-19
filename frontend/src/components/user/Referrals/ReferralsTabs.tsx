import React from 'react';
import DynamicTabs from '@/components/common/Tabs';
import DirectReferrals from './DirectReferrals';
import TeamReferrals from './TeamReferrals';




const ReferralsTabs = () => {
    const tabs = [
        {
            id: 1,
            title: 'Direct Referrals',
            content: <DirectReferrals />
        },
        {
            id: 2,
            title: 'Team Referrals',
            content: <TeamReferrals />
        },
    ];

    return (
        <div className="app">
            <DynamicTabs tabs={tabs} />
        </div>
    );
};

export default ReferralsTabs;
