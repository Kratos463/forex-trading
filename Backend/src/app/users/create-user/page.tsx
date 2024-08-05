"use client";
import React, { useState, FormEvent } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SelectCountryList from 'react-select-country-list';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { register } from "@/Redux/User";


const CreateMember: React.FC = () => {
    const dispatch = useAppDispatch()
    const { isLoading } = useAppSelector((state) => state.user);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        referredBy: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        terms: false,
        ismarketingId: false,
    });

    const [errors, setErrors] = useState({
        referredBy: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: '',
        country: '',
        phone: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const handlePhoneChange = (value: string) => {
        setFormData(prev => ({ ...prev, phone: value }));
    };
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, country: value }));
    };


    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.terms) newErrors.terms = 'You must agree to the Terms and Conditions';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        return newErrors;
    };


    const handleRegisterSubmit = async (event: FormEvent) => {
        event.preventDefault();


        const formValidationErrors = validateForm();
        setErrors(formValidationErrors);

        if (Object.keys(formValidationErrors).length > 0) {
            return;
        }

        try {
            const response = await dispatch(register(formData)).unwrap();

            // Assuming response contains a message on successful registration
            if (response.message) {
                setSuccessMessage(response.message);
                // Reset form data
                setFormData({
                    firstName: '',
                    lastName: '',
                    referredBy: '',
                    phone: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    country: '',
                    terms: false,
                    ismarketingId: false,
                });
                setError(null);
            }
        } catch (err: any) {
            setError(err.message || "Registration failed");
            setSuccessMessage(null);
        }
    };


    const countryOptions = SelectCountryList().getData();

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Create Member" />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}


            <div className="grid grid-cols-1 gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Create Member
                        </h3>
                    </div>
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="p-6.5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Referral By
                                    </label>
                                    <input
                                        type="text"
                                        name="referredBy"
                                        id="referredBy"
                                        value={formData.referredBy}
                                        onChange={handleInputChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                                    />
                                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                                    />
                                    {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Phone
                                    </label>
                                    <PhoneInput
                                        country={'us'}
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        inputProps={{
                                            id: 'phone',
                                            name: 'phone',
                                            required: true,
                                            placeholder: 'Phone'
                                        }}
                                        containerClass="w-full"
                                    />
                                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Country
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleCountryChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        {countryOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country && <p className="text-red-500">{errors.country}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4.5">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                                    />
                                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                                    />
                                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                            <div className="mb-4.5 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleInputChange}
                                    className="h-5 w-5"
                                    id="terms"
                                />
                                <label className="text-sm font-medium text-black dark:text-white">
                                    I accept the terms and conditions
                                </label>
                                {errors.terms && <p className="text-red-500">{errors.terms}</p>}
                            </div>
                            <div className="mb-4.5 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="ismarketingId"
                                    checked={formData.ismarketingId}
                                    onChange={handleInputChange}
                                    className="h-5 w-5"
                                    id="ismarketingId"
                                />
                                <label className="text-sm font-medium text-black dark:text-white">
                                    Is marketing ID
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </DefaultLayout>
    );
};

export default CreateMember;
