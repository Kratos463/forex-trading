import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getPromotions } from "@/Redux/Promotion";
import Image from "next/image";

const PromotionTable = () => {
    const dispatch = useAppDispatch();
    const { promotions, pagination, isLoading } = useAppSelector((state) => state.promotion);

    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        dispatch(getPromotions({ page, limit }));
    }, [page, dispatch]);

    const handleNextPage = () => {
        if (page < pagination.totalPages) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Promotion List
            </h4>
            <div className="w-full">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Cover Image
                            </th>
                            <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                                Name
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Total Self Investment
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Total Team Investment
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Total Direct Referral
                            </th>
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                                Date Info
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {promotions?.map((promotion) => (
                            <tr key={promotion._id}>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <div className="flex items-center gap-3">
                                        {promotion.image ? (
                                            <Image
                                                src={promotion.image}
                                                alt="cover image"
                                                width={48}
                                                height={48}
                                                className="rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                        )}
                                    </div>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-success dark:text-success font-medium">{promotion.name}</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{promotion.totalSelfInvestment} USDT</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{promotion.totalTeamInvestment} USDT</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{promotion.totalDirectReferral} USDT</p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        Start: {format(new Date(promotion.startDate), "dd MMM yyyy hh:mm a")}
                                    </p>
                                    <p className="text-black dark:text-white">
                                        End: {format(new Date(promotion.endDate), "dd MMM yyyy hh:mm a")}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                    <p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium ${promotion.status === "active"
                                        ? "bg-success text-success"
                                        : promotion.status === "expire"
                                            ? "bg-warning text-warning"
                                            : "bg-danger text-danger"
                                        }`}>
                                        {promotion.status}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between">
                <button
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:bg-gray-200"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 disabled:bg-gray-200"
                    onClick={handleNextPage}
                    disabled={page === pagination.totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PromotionTable;
