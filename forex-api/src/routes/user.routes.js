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
} = require("../controllers/users.controller")
const { createInvestment, getInvestment } = require("../controllers/inverstment.controller")
const { addAmountInWallet, getCurrentUserWalletDetails, walletTransactionList } = require("../controllers/wallet.controller")

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/fetchUser').get(verifyUser, fetchCurrentUser)
router.route("/update-user").patch(verifyUser, updateUserDetails)
router.route("/change-password").patch(verifyUser, changePassword)

// inverstment routes
router.route('/investment').post(verifyUser, createInvestment)
router.route('/investment').get(verifyUser, getInvestment)
router.route('/referrals').get(verifyUser, directReferrals)

// withdrawal Request Route
router.route('/withdrawal-request').post(verifyUser, withdrawalRequest)

// wallet routes
router.route('/add-fund-wallet').post(verifyUser, addAmountInWallet)
router.route('/wallet-transactions').get(verifyUser, walletTransactionList)
router.route("/get-user-wallet").get(verifyUser, getCurrentUserWalletDetails)

module.exports = router