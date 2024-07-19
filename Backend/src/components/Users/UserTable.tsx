import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { getUsers } from "@/Redux/User";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import DefaultLayout from "../Layouts/DefaultLayout";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

const UserTable = () => {
  const dispatch = useAppDispatch();
  const { users, pagination, status, error } = useAppSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    dispatch(getUsers({ page, limit }));
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
    <DefaultLayout>
      <Breadcrumb pageName="Members List"/>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Users List
        </h4>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>{error}</p>}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  User Details
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Email Verified
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Wallet
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Join on
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users?.map((user) => (
                <tr key={user._id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.firstName} {user.lastName}
                    </h5>
                    <p className="text-sm">UID: {user.username}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.email}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${user.isEmailVerified ? "bg-success text-success" : "bg-danger text-danger"
                        }`}
                    >
                      {user.isEmailVerified ? "Yes" : "No"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-sm">
                      W. Balance: {user.wallet?.balance}
                    </p>
                    <p className="text-sm">T. Investment: {user.wallet?.totalInvestment ? user.wallet.totalInvestment : "0"}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {format(new Date(user.createdAt), "dd MMM yyyy hh:mm a")}
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
    </DefaultLayout>
  );
};

export default UserTable;
