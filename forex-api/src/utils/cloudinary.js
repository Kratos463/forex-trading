const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("Local file path is missing.");
        }

        // Check if file exists before uploading
        if (!fs.existsSync(localFilePath)) {
            throw new Error("File does not exist at the given path.");
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });


        // Delete local file if upload succeeds
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);

        // Delete local file in case of any error
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
                console.log("Local file deleted successfully after error.");
            } catch (unlinkError) {
                console.error("Error deleting local file:", unlinkError);
            }
        } else {
            console.log("Local file does not exist, no need to delete.");
        }

        return null; // Handle error gracefully
    }
};

module.exports = { uploadOnCloudinary };
