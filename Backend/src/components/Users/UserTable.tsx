import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { getUsers, updateUserDetails } from "@/Redux/User";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import DefaultLayout from "../Layouts/DefaultLayout";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import UserEditModal from "../EditModels/UserEditModel";

const UserTable = () => {
  const dispatch = useAppDispatch();
  const { users, pagination, status, error } = useAppSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByJoinDate, setFilterByJoinDate] = useState('newest');
  const [userStatus, setUserStatus] = useState<{ [key: string]: boolean }>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 20;

  useEffect(() => {
    dispatch(getUsers({ page, limit }));
  }, [dispatch, page, filterByJoinDate]);

  useEffect(() => {
    if (users) {
      const initialStatus = users.reduce((acc, user) => {
        acc[user._id] = user.isDisabled;
        return acc;
      }, {} as { [key: string]: boolean });
      setUserStatus(initialStatus);
    }
  }, [users]);

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

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleUser = (userId: string, isEnabled: boolean) => {
    // Handle toggle user functionality
    console.log(`Toggle user: ${userId}, Enable: ${!isEnabled}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (updatedUser: any) => {
    await dispatch(updateUserDetails(updatedUser))
    await dispatch(getUsers({ page, limit }))
    handleCloseModal();
  };

  const filteredUsers = users?.filter(user =>
  (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.includes(searchTerm))
  ).sort((a, b) => {
    if (filterByJoinDate === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Members List" />
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Users List
          </h4>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by Name or UID"
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
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Wallet
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Join on
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers?.map((user) => (
                <tr key={user._id}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {user.firstName} {user.lastName}
                    </h5>
                    <p className="text-sm">UID: {user.username}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white">{user.email}</p>
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 px-2 text-sm font-medium ${user.isEmailVerified ? "bg-success text-success" : "bg-danger text-danger"
                        }`}
                    >
                      Verified: {user.isEmailVerified ? "Yes" : "No"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                    <p className="text-sm">
                      Balance: {(user.wallet?.balance)?.toFixed(2)}
                    </p>
                    <p className="text-sm">Investment: {(user.wallet?.totalInvestment)?.toFixed(2)}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {format(new Date(user.createdAt), "dd MMM yyyy hh:mm a")}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center ">
                    <button onClick={() => handleToggleUser(user._id, user.isDisabled)} className="text-yellow-500 hover:text-yellow-700">
                      <FontAwesomeIcon icon={user.isDisabled ? faToggleOn : faToggleOff} />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className=" ml-4 text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
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
      <UserEditModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </DefaultLayout>
  );
};

export default UserTable;
