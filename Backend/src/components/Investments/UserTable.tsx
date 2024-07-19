import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fetchInvestments } from "@/Redux/User";


const InvestmentTable = () => {
  const dispatch = useAppDispatch();
  const { investments, pagination, status, error } = useAppSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    dispatch(fetchInvestments({ page, limit }));
  }, [page]);


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
        Investments List
      </h4>
      <div className="w-full">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Investment ID
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Amount
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Weekly %
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                Investment Dates
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Direct Referral
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                ROI Start On
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {investments?.map((investment) => (
              <tr key={investment._id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {investment._id}
                  </h5>
                  <p className="text-sm">UID: {investment.userDetails.username}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-success dark:text-success font-medium">{investment.amount} USDT</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 font-medium ${investment.status === "active"
                      ? "bg-success text-success"
                      : investment.status === "completed"
                        ? "bg-warning text-warning"
                        : "bg-danger text-danger"
                      }`}
                  >
                    {investment.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white ">{investment.weeklyRewardPercentage}%</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    Start:
                    {format(new Date(investment.investmentDate), "dd MMM yyyy hh:mm a")}
                  </p>
                  <p className="text-black dark:text-white">
                    Expiry:
                    {format(new Date(investment.endDate), "dd MMM yyyy hh:mm a")}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${investment.referralBonusGiven === true
                        ? "bg-success text-success"
                        : investment.referralBonusGiven === false
                          ? "bg-danger text-danger"
                          : "bg-warning text-warning"
                      }`}
                  >
                    {investment.referralBonusGiven ? "Yes" : "No"} {/* Display Yes or No */}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {format(new Date(investment.returnStartFrom), "dd MMM yyyy hh:mm a")}
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

export default InvestmentTable;
