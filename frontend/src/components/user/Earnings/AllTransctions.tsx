import React from 'react';
import DynamicTable from '@/components/common/DynamicDataTable';

const AllTranstions: React.FC = () => {
    const columns = [
        { header: 'Transaction ID', accessor: 'transactionId' },
        { header: 'Date', accessor: 'date' },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Type', accessor: 'type' },
        { header: 'Status', accessor: 'status' },
    ];

    const data = [
        { transactionId: 'TXN123456', date: '2023-07-01', amount: '1500 USD', type: 'Credit', status: 'Completed' },
        { transactionId: 'TXN123457', date: '2023-07-02', amount: '200 USD', type: 'Debit', status: 'Pending' },
        { transactionId: 'TXN123458', date: '2023-07-03', amount: '500 USD', type: 'Credit', status: 'Failed' },
        // Add more transactions as needed
    ];

    return (
        <div className="App">
            <DynamicTable title='All Transactions' columns={columns} data={data} />
        </div>
    );
};

export default AllTranstions;
