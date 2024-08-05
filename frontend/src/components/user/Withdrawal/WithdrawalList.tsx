import React, { useEffect, useState } from 'react';
import DynamicTable from '@/components/common/DynamicDataTable';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { fetchWithdrawalRequest, verifyWithdrawalRequest } from '@/Redux/Wallet';

const WithdrawalList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { withdrawalRequests } = useAppSelector((state) => state.wallet);

    useEffect(() => {
        dispatch(fetchWithdrawalRequest());
    }, [dispatch]);

    const [code, setCode] = useState<string>('');
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    const handleVerifyCode = async (requestId: string) => {
        if (code.trim() === '') {
            return;
        }

        try {
            const resultAction = await dispatch(verifyWithdrawalRequest({ requestId, code }));
            await dispatch(fetchWithdrawalRequest());
            if (verifyWithdrawalRequest.fulfilled.match(resultAction)) {
                toast.success('Withdrawal request successful!');
            } else {

                toast.error(resultAction.payload as string || 'Invalid Code. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setCode('');
            setSelectedRequestId(null);
        }
    };

    const columns = [
        { header: 'Wallet Address', accessor: 'walletAddress' },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Status', accessor: 'status' },
        { header: 'Request Date', accessor: 'requestDate' },
        { header: 'Completed Date', accessor: 'approvalDate' },
    ];

    const data = withdrawalRequests?.map(request => ({
        walletAddress: request.walletAddress,
        amount: <span style={{ color: 'green', fontWeight: 'bold' }}>{request.amount} USDT</span>,
        requestDate: format(new Date(request.requestDate), 'dd MMM yyyy hh:mm a'),
        approvalDate: request.approvalDate ? format(new Date(request.approvalDate), 'dd MMM yyyy hh:mm a') : 'N/A',
        status: (
            <>
                {request.status === 'pending' ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                handleVerifyCode(request._id);
                                setSelectedRequestId(request._id);
                            }}
                            disabled={code.trim() === ''}
                        >
                            Verify Code
                        </button>
                    </>
                ) : (
                    <span style={{ color: request.status === 'completed' ? 'green' : 'red', fontWeight: 'bold' }}>
                        {request.status}
                    </span>
                )}
            </>
        ),
    }));

    return (
        <div className="App">
            <DynamicTable title="Withdrawal List" columns={columns} data={data} />
        </div>
    );
};

export default WithdrawalList;
