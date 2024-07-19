import React from 'react';
import Profile from './Profile';
import Password from './Password';
import DynamicTabs from '@/components/common/Tabs';


const SettingsTabs = () => {
    const tabs = [
        {
            id: 1,
            title: 'Profile',
            content: <Profile />, 
        },
        {
            id: 2,
            title: 'Password',
            content: <Password />, 
        },
    ];

    return (
        <div className="app">
            <DynamicTabs tabs={tabs} />
        </div>
    );
};

export default SettingsTabs;
