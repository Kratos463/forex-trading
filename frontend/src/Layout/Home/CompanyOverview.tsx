import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUsers, faWallet, faChartLine } from '@fortawesome/free-solid-svg-icons';


const CompanyOverview: React.FC = () => {
    return (
        <div className='page-content'>
            <div className="company-overview">
                <div className="overview-item">
                    <FontAwesomeIcon icon={faUsers} className="icon" />
                    <h6>50,000+</h6>
                    <p>Active Users</p>
                </div>
                <div className="overview-item">
                    <FontAwesomeIcon icon={faDollarSign} className="icon" />
                    <h6>10,000,000+</h6>
                    <p>Total Investment</p>
                </div>
                <div className="overview-item">
                    <FontAwesomeIcon icon={faWallet} className="icon" />
                    <h6>10,00,000+</h6>
                    <p>Monthly Withdrawals</p>
                </div>
                <div className="overview-item">
                    <FontAwesomeIcon icon={faChartLine} className="icon" />
                    <h6>200+</h6>
                    <p>Daily Investments</p>
                </div>
            </div>
        </div>
    );
};

export default CompanyOverview;
