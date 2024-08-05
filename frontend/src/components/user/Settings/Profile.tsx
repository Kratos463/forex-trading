import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/Redux/Hooks';
import { fetchUser, updateUser } from '@/Redux/Auth';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { isLoading, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("user data", formData)
    dispatch(updateUser(formData))
      .then((resultAction) => {
        if (resultAction.payload) {
          dispatch(fetchUser());
          toast.success("User profile updated")
        }
      })
      .catch((error) => {
        console.error("Failed to update user:", error);
        // Handle error
      });
  };

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className='add-fund-container'>
      <div className='add-fund-content'>
        <h6>Update Profile Details</h6>
        <form className='form-normal' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>User ID (not change)</label>
            <input
              className='form-control'
              type="text"
              name="username"
              value={formData.username}
              readOnly
            />
          </div>
          <div className='form-group'>
            <label>First Name</label>
            <input
              className='form-control'
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Last Name</label>
            <input
              className='form-control'
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input
              className='form-control'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>Phone</label>
            <input
              className='form-control'
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className='button-full'>{isLoading ? "Updating" : "Update"}</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
