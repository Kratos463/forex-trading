import React from 'react';
import DynamicTable from '@/components/common/DynamicDataTable';
import { format } from "date-fns";

interface USDTTransaction {
    _id: string;
    amount: number;
    createdAt: string;
    transactionHash: string;
}

interface DirectReferralProps {
    transactions: USDTTransaction[];
}

const WalletTransactions: React.FC<DirectReferralProps> = ({ transactions }) => {
    const columns = [
        { header: 'Transaction Hash', accessor: 'transactionHash' },
        { header: 'Amount', accessor: 'amount', },
        { header: 'Date', accessor: 'date' },
    ];


    const data = transactions?.map(transaction => ({
        transactionHash: transaction.transactionHash,
        date: format(new Date(transaction.createdAt), "dd MMM yyyy hh:mm a"),
        amount: <span style={{color: "green", fontWeight: "bold"}}>{transaction.amount} USDT</span>,
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
