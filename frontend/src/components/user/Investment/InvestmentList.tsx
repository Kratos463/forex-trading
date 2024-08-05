import DynamicTable from '@/components/common/DynamicDataTable';
import React from 'react';
import { format } from "date-fns";

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
        investmentDate:  format(new Date(transaction.investmentDate), "dd MMM yyyy hh:mm a"),
        endDate:  format(new Date(transaction.endDate), "dd MMM yyyy hh:mm a"),
        amount: <span style={{color: "green", fontWeight: "bold"}}>{transaction.amount} USDT</span>,
        status: (
            <span style={{ color: transaction.status === 'active' ? 'green' : 'red', fontWeight: 'bold' }}>
                {transaction.status}
            </span> 
        ),      
        totalRewardEarned: transaction.totalRewardEarned,
    }));

    return (
        <div className="App">
            {data?.length > 0 ? (
                <DynamicTable title="Direct Referral" columns={columns} data={data} />
            ) : (
                <div  className='not-found-text'>No investments found.</div>
            )}
        </div>
    );
};

export default InvestmentList;
