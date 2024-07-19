const Promotion = require("../models/promotions.model")
const { uploadOnCloudinary } = require("../utils/cloudinary")

const addPromotion = async (req, res) => {
    const { name, title, description, startDate, endDate, totalSelfInvestment,
        totalTeamInvestment, totalDirectReferral
    } = req.body


    try {

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ error: "End date must be after start date", success: false });
        }
        const coverImageLocalPath = req.files?.coverImage[0]?.path

        if (!coverImageLocalPath) {
            return res.status(400).json({ error: "Cover Image is required", success: false })
        }

        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        const newPromotion = new Promotion({
            name: name,
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            totalDirectReferral: totalDirectReferral,
            totalSelfInvestment: totalSelfInvestment,
            totalTeamInvestment: totalTeamInvestment,
            image: coverImage.url,
            status: "active"
        })

        await newPromotion.save()

        return res.status(200).json({ message: "Promotion create successfully", success: true })

    } catch (error) {
        console.error('Error while adding promotion:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }

}

const getPromotionList = async (req, res) => {
    try {
        // Get page and limit from query parameters, with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate the starting index
        const startIndex = (page - 1) * limit;

        // Get the total number of promotions
        const totalPromotions = await Promotion.countDocuments();

        // Fetch promotions with pagination
        const promotions = await Promotion.find({})
            .skip(startIndex)
            .limit(limit);

        if (!promotions || promotions.length === 0) {
            return res.status(200).json({ error: "No promotion found", success: false });
        }

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalPromotions / limit);

        return res.status(200).json({
            message: "Promotions fetched successfully",
            success: true,
            promotions: promotions,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalPromotions
            }
        });
    } catch (error) {
        console.error('Error while fetching promotions:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};


module.exports = { addPromotion, getPromotionList }