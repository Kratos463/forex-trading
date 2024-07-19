import React, { useState } from 'react';

type Tab = {
  id: number;
  title: string;
  content: React.ReactNode; 
};

type TabsProps = {
  tabs: Tab[];
};

const DynamicTabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(tabs[0].id);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
  };

  return (
    <div className="tabs-container">
      <div className="tab-list">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${tab.id === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div key={tab.id} className={`tab-pane ${tab.id === activeTab ? 'active' : ''}`}>
            {tab.id === activeTab && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicTabs;
