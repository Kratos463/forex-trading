import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { fetchWithdrawalRequests, updateWithdrawalRequest } from "@/Redux/User";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Request {
    _id: string;
    userDetails: {
        username: string;
    };
    amount: number;
    requestDate: string;
    walletAddress: string;
    status: string;
}

interface RootState {
    user: {
        requests: Request[];
    };
}

const WithdrawalRequestTable = () => {
    const dispatch = useAppDispatch();
    const requests = useAppSelector((state: RootState) => state.user.requests);
    const [status, setStatus] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(fetchWithdrawalRequests());
    }, [dispatch]);

    useEffect(() => {
        if (requests) {
            const initialStatus = requests.reduce((acc: Record<string, string>, request) => {
                acc[request._id] = request.status;
                return acc;
            }, {});
            setStatus(initialStatus);
        }
    }, [requests]);

    const handleStatusChange = (requestId: string, newStatus: string) => {
        setStatus((prevStatus) => ({
            ...prevStatus,
            [requestId]: newStatus,
        }));

        dispatch(updateWithdrawalRequest({ withdrawalId: requestId, status: newStatus }))
            .unwrap()
            .then(() => {
                dispatch(fetchWithdrawalRequests());
            })
            .catch((error) => {
                console.error("Failed to update withdrawal request status:", error);
            });
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Withdrawal Request List
            </h4>
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                Request Details
                            </th>
                            <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                                Amount
                            </th>
                            <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                                Request On
                            </th>
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                                Wallet Address
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {requests?.map((request) => (
                            <tr key={request._id}>
                                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {request._id}
                                    </h5>
                                    <p className="text-sm">UID: {request.userDetails.username}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-success dark:text-success font-medium">{request.amount} USDT</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {format(new Date(request.requestDate), "dd MMM yyyy hh:mm a")}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{request.walletAddress}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    {/* <select
                                        value={status[request._id] || "Pending"}
                                        onChange={(e) => handleStatusChange(request._id, e.target.value)}
                                        className="text-black dark:text-white bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-md"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select> */}
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                        Send
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WithdrawalRequestTable;
