import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fetchInvestments } from "@/Redux/User";
import DefaultLayout from "../Layouts/DefaultLayout";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

const InvestmentTable = () => {
  const dispatch = useAppDispatch();
  const { investments, pagination, status, error } = useAppSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByJoinDate, setFilterByJoinDate] = useState('newest');
  const limit = 20;

  useEffect(() => {
    dispatch(fetchInvestments({ page, limit }));
  }, [dispatch, page, filterByJoinDate]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByJoinDate(e.target.value);
  };

  const handleActionChange = (investmentId: string, action: string) => {
    if (action === 'edit') {
      // dispatch(editInvestment(investmentId));
    } else if (action === 'toggle') {
      const investment = investments.find(inv => inv._id === investmentId);
      if (investment) {
        // dispatch(toggleInvestmentStatus(investmentId, !investment.isDisabled));
      }
    }
  };

  const filteredInvestments = investments?.filter(investment =>
    investment.userDetails.username.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (filterByJoinDate === 'newest') {
      return new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime();
    } else {
      return new Date(a.investmentDate).getTime() - new Date(b.investmentDate).getTime();
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Investments List" />
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Investments List
          </h4>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by Username"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-stroke dark:border-strokedark rounded-md p-2"
            />
            <select
              value={filterByJoinDate}
              onChange={handleFilterChange}
              className="border border-stroke dark:border-strokedark rounded-md p-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>{error}</p>}
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto min-w-[1000px]">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Investment ID
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Amount
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
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredInvestments?.map((investment) => (
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
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                    <p className="text-black dark:text-white ">{investment.weeklyRewardPercentage}%</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      Start: {format(new Date(investment.investmentDate), "dd MMM yyyy hh:mm a")}
                    </p>
                    <p className="text-black dark:text-white">
                      Expiry: {format(new Date(investment.endDate), "dd MMM yyyy hh:mm a")}
                    </p>
                    <p className="text-black dark:text-white">
                      Roi Start: {format(new Date(investment.returnStartFrom), "dd MMM yyyy hh:mm a")}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
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
                    <select
                      value={investment.isDisabled ? "deactivate" : "activate"}
                      onChange={(e) => {
                        if (e.target.value === "toggle") {
                          // dispatch(toggleInvestmentStatus(investment._id)); // Dispatch toggle action
                        } else if (e.target.value === "edit") {
                          // Handle edit action
                          // dispatch(editInvestment(investment._id)); // Dispatch edit action
                        }
                      }}
                      className="border border-stroke dark:border-strokedark rounded-md p-2"
                    >
                      <option value="toggle">
                        {investment.isDisabled ? "Deactivate" : "Activate"}
                      </option>
                      <option value="edit">Edit</option>
                    </select>
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
            Page {pagination?.currentPage} of {pagination?.totalPages}
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
    </DefaultLayout>
  );
};

export default InvestmentTable;
