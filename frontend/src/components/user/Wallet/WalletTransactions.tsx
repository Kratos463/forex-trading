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

interface DirectReferralProps {
    transactions: Transaction[];
}

const WalletTransactions: React.FC<DirectReferralProps> = ({ transactions }) => {
    const columns = [
        { header: 'Transaction ID', accessor: 'transactionId' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', accessor: 'amount', },
    ];

    const filteredTransactions = transactions?.filter(transaction => transaction.commissionType === null && transaction.type === "deposit");

    const data = filteredTransactions?.map(transaction => ({
        transactionId: transaction._id,
        date: new Date(transaction.transactionDate).toLocaleDateString(),
        amount: <span style={{color: "green"}}>{transaction.amount} USDT</span>,
    }));

    return (  
        <div className="App">
            {data?.length > 0 ? (
                <DynamicTable title="Wallet Transactions" columns={columns} data={data} />
            ) : (
                <div>No transactions found.</div>
            )}
        </div>
    );
};

export default WalletTransactions;
