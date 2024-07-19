import React from 'react';
import DynamicTable from '@/components/common/DynamicDataTable';

const WithdrawalList: React.FC = () => {
    const columns = [
        { header: 'Wallet Address', accessor: 'walletAddress' },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Status', accessor: 'status' },
        { header: 'Cancel', accessor: 'cancel' },
        { header: 'Request Date', accessor: 'requestDate' },
    ];

    const data = [
        { walletAddress: '37nrxBoB79gdwhbKsRatst8ixuEHnah', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Denied', cancel: <button>Cancel</button> },
        { walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Pending', cancel: <button>Cancel</button> },
        { walletAddress: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Completed', cancel: <button>Cancel</button> },
        { walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Pending', cancel: <button>Cancel</button> },
        { walletAddress: '3E8ociqZa9mZUSwGdSmAEMAoAxBK3FNDcd', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Denied', cancel: <button>Cancel</button> },
        { walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf2u6l', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Completed', cancel: <button>Cancel</button> },
        { walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Pending', cancel: <button>Cancel</button> },
        { walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Completed', cancel: <button>Cancel</button> },
        { walletAddress: '3E8ociqZa9mZUSwGdSmAEMAoAxBK3FNDcd', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Denied', cancel: <button>Cancel</button> },
        { walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf2u6l', requestDate: '2024-05-04 05:47', amount: '1500 USD', status: 'Pending', cancel: <button>Cancel</button> },
    ];

    return (
        <div className="App">
            <DynamicTable title='Withdrawal List' columns={columns} data={data} />
        </div>
    );
};

export default WithdrawalList;
