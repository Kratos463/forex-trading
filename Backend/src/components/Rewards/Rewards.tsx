import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { createPromotion } from "@/Redux/Promotion";

const AddRewards: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.promotion)
    const editorEl = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        coverImage: new File([], ''),
        totalSelfInvestment: 0,
        totalTeamInvestment: 0,
        totalDirectReferral: 0,
    });
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                coverImage: file,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(createPromotion(formData))
            .unwrap()
            .then(() => {
                setSuccessMessage('Promotion created successfully!');
                setFormData({
                    name: '',
                    title: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    coverImage: new File([], ''),
                    totalSelfInvestment: 0,
                    totalTeamInvestment: 0,
                    totalDirectReferral: 0,
                });
                
            })
            .catch(error => {
                console.error('Failed to create promotion:', error);
                // Handle error state or display error message
            });
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Create Promotion" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="col-span-5">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Add Promotions
                            </h3>
                        </div>

                        {successMessage && (
                            <div className="mt-4 p-3 bg-green-100 text-green-900 rounded-md">
                                {successMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Start Date and Time (GMT)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            End Date and Time (GMT)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter name"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter title"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/3">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Self Investment
                                        </label>
                                        <input
                                            type="number"
                                            name="totalSelfInvestment"
                                            value={formData.totalSelfInvestment}
                                            onChange={handleChange}
                                            placeholder="Enter self investment"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/3">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Team Investment
                                        </label>
                                        <input
                                            type="number"
                                            name="totalTeamInvestment"
                                            value={formData.totalTeamInvestment}
                                            onChange={handleChange}
                                            placeholder="Enter team investment"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/3">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Direct Referrals
                                        </label>
                                        <input
                                            type="number"
                                            name="totalDirectReferral"
                                            value={formData.totalDirectReferral}
                                            onChange={handleChange}
                                            placeholder="Enter direct referrals"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Upload Image
                                    </label>
                                    <input
                                        required
                                        type="file"
                                        name="coverImage"
                                        onChange={handleFileChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Description
                                    </label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={(e, editor) => {
                                            const data = editor.getData();
                                            setFormData(prevState => ({
                                                ...prevState,
                                                description: data,
                                            }));
                                        }}
                                        ref={editorEl}
                                    />
                                </div>

                                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    {isLoading ? "Processing..." : "Add Promotion"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </DefaultLayout>
    );
};

export default AddRewards;
