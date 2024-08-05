import React from 'react';
import DynamicTable from '@/components/common/DynamicDataTable';
import { format } from 'date-fns';

interface Transaction {
    _id: string;
    commissionType: string | null;
    amount: number;
    details: string;
    transactionDate: string;
}

interface DirectReferralProps {
    transactions: Transaction[];
}

const DirectReferral: React.FC<DirectReferralProps> = ({ transactions }) => {
    const columns = [
        { header: 'Transaction ID', accessor: 'transactionId' },
        { header: 'Date', accessor: 'date' },
        { header: 'Details', accessor: 'details' },
        { header: 'Amount', accessor: 'amount', },
    ];

    const filteredTransactions = transactions?.filter(transaction => transaction.commissionType === 'direct_referral');

    const data = filteredTransactions?.map(transaction => ({
        transactionId: transaction._id,
        date: format(new Date(transaction.transactionDate), "dd MMM yyyy hh:mm a"),
        details: transaction.details,
        amount: <span style={{color: "green", fontWeight: "bold"}}>{transaction.amount} USDT</span>,
    }));

    return (  
        <div className="App">
            {data?.length > 0 ? (
                <DynamicTable title="Direct Referral Transactions" columns={columns} data={data} />
            ) : (
                <div className='not-found-text'>No direct referral transactions found.</div>
            )}
        </div>
    );
};

export default DirectReferral;
