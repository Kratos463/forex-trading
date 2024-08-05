"use client"
import { useAppSelector, useAppDispatch } from '@/Redux/Hooks';
import { changePassword, fetchUser, updateUser } from '@/Redux/Auth';
import { toast } from 'react-toastify';
import React, { useState } from 'react';


const Password = () => {

  const dispatch = useAppDispatch();
  const { isLoading, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(changePassword(formData))
      .then((resultAction) => {
        if (resultAction.payload) {
          toast.success("Password changed")
        }
      })
      .catch((error) => {
        console.error("Failed to update user:", error);
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
            <label>Current Password</label>
            <input
              className='form-control'
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-group'>
            <label>New Password</label>
            <input
              className='form-control'
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </div>


          <button type="submit" className='button-full'>{isLoading ? "Updating" : "Update"}</button>
        </form>
      </div>
    </div>
  );
}

export default Password