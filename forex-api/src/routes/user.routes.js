const { Router } = require("express")
const verifyUser = require("../middleware/verifyUser")
const {
    registerUser,
    loginUser,
    fetchCurrentUser,
    withdrawalRequest,
    directReferrals,
    updateUserDetails,
    changePassword,
    sendVerificationLink,
    fetchWithdrawalRequests,
    verifyCode,
} = require("../controllers/users.controller")
const { createInvestment, getInvestment } = require("../controllers/inverstment.controller")
const { addAmountInWallet, getCurrentUserWalletDetails } = require("../controllers/wallet.controller")
const { getPromotionList } = require("../controllers/promotion.controller")

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/fetchUser').get(verifyUser, fetchCurrentUser)
router.route("/update-user").patch(verifyUser, updateUserDetails)
router.route("/change-password").patch(verifyUser, changePassword)
router.route("/send-verification-mail").post(verifyUser, sendVerificationLink)

// inverstment routes
router.route('/investment').post(verifyUser, createInvestment)
router.route('/investment').get(verifyUser, getInvestment)
router.route('/referrals').get(verifyUser, directReferrals)

// withdrawal Request Route
router.route('/withdrawal-request').post(verifyUser, withdrawalRequest)
router.route('/withdrawal-request').get(verifyUser, fetchWithdrawalRequests)
router.route('/withdrawal-request-verify').post(verifyUser, verifyCode)

// wallet routes
router.route('/add-fund-wallet').post(verifyUser, addAmountInWallet)
router.route("/get-user-wallet").get(verifyUser, getCurrentUserWalletDetails)

// promotions routes
router.route("/get-promotions").get(verifyUser, getPromotionList)

module.exports = router