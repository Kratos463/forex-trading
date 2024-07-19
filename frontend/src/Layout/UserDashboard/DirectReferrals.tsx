import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/Redux/Hooks';
import { fetchReferrals } from '@/Redux/Auth';

interface Referral {
    _id: string;
    username: string;
    createdAt: string;
}

interface DirectReferralsProps {
    // Define props if needed
}

const DirectReferrals: React.FC<DirectReferralsProps> = () => {
    const dispatch = useAppDispatch();
    const { isLoading, referrals } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Fetch referrals on component mount
        dispatch(fetchReferrals({ page: 1, limit: 15 })); // Initial fetch for first page, adjust limit as needed
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(fetchReferrals({ page, limit: 15 })); // Fetch referrals for the selected page
    };

    return (
        <div className="direct-referrals">
            {isLoading ? (
                <p>Loading...</p>
            ) : referrals ? (
                <div className="tableContainer">
                    <h6 style={{ textAlign: 'center' }}>Your Direct Referrals</h6>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Referral ID</th>
                                <th>Join On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.directReferrals.map((referral: Referral, index: number) => (
                                <tr key={referral._id}>
                                    <td>{referral.username}</td>
                                    <td>{referral.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: referrals.totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={referrals.currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Error: Failed to fetch referrals.</p>
            )}
        </div>
    );
};

export default DirectReferrals;
