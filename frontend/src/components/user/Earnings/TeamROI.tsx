import React from 'react';
import DynamicTable from '@/components/common/DynamicDataTable';

interface Transaction {
    _id: string;
    type: string;
    commissionType: string | null;
    amount: number;
    details: string;
    transactionDate: string;
}

interface TeamROIProps {
    transactions: Transaction[];
}

const TeamROI: React.FC<TeamROIProps> = ({transactions}) => {
    const columns = [
        { header: 'Transaction ID', accessor: 'transactionId' },
        { header: 'Date', accessor: 'date' },
        { header: 'Details', accessor: 'details' },
        { header: 'Type', accessor: 'type' },
        { header: 'Amount', accessor: 'amount', },
    ];

    const filteredTransactions = transactions?.filter(transaction => transaction.commissionType === 'team_roi');

    const data = filteredTransactions?.map(transaction => ({
        transactionId: transaction._id,
        date: new Date(transaction.transactionDate).toLocaleDateString(),
        details: transaction.details,
        type: transaction.type,
        amount: `${transaction.amount} USDT`,
    }));

    return (
        <div className="App">
        {data?.length > 0 ? (
            <DynamicTable title="Direct Referral" columns={columns} data={data} />
        ) : (
            <div className='not-found-text'>No team roi transactions found.</div>
        )}
    </div>
    );
};

export default TeamROI;
