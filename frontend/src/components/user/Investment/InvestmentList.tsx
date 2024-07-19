import DynamicTable from '@/components/common/DynamicDataTable';
import React from 'react';

interface Investment {
    _id: string;
    amount: string;
    status: string;
    totalRewardEarned: number;
    endDate: string;
    investmentDate: string;
}

interface InvestmentsProps {
    investments: Investment[];
    loading: boolean;
    error: string | null;
}

const InvestmentList: React.FC<InvestmentsProps> = ({ investments }) => {

    const columns = [
        { header: 'Investment ID', accessor: 'investmentId' },
        { header: 'Amount', accessor: 'amount', },
        { header: 'Investment Date', accessor: 'investmentDate', },
        { header: 'End Date', accessor: 'endDate', },
        { header: 'Status', accessor: 'status', },
        { header: 'Reward Earned', accessor: 'totalRewardEarned', },
    ];

    const data = investments?.map(transaction => ({
        investmentId: transaction._id,
        investmentDate: new Date(transaction.investmentDate).toLocaleDateString(),
        endDate: new Date(transaction.endDate).toLocaleDateString(),
        amount: <span style={{color: "green"}}>{transaction.amount} USDT</span>,
        status: transaction.status,
        totalRewardEarned: transaction.totalRewardEarned,
    }));

    return (
        <div className="App">
            {data?.length > 0 ? (
                <DynamicTable title="Direct Referral" columns={columns} data={data} />
            ) : (
                <div>No investments found.</div>
            )}
        </div>
    );
};

export default InvestmentList;
