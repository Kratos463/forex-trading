const { Router } = require("express")
const {
    registerAdmin,
    loginAdmin,
    verifyAdminEmail,
    disableAdmin,
    enableAdmin,
    changePassword,
    getAllAdmins,
    updateWithdrawalStatus,
    disableUser,
    enableUser,
    getAllUser,
    getAllInvestments,
    getAllWithdrawalReq,
    addAmountInUserWallet,
    fetchAdmin
} = require("../controllers/admin.controller")
const verifySuperAdmin = require("../middleware/verifySuperAdmin")
const { addOrUpdateSettings, getSettings, updateDirectReferralReturnRate, updateReferralCommissionRates, updateWeeklyReturnRate } = require("../controllers/settings.controller")
const { triggerScheduledTasks } = require("../controllers/inverstment.controller")
const { addPromotion, getPromotionList } = require("../controllers/promotion.controller")
const upload = require("../middleware/multer.middleware")

const router = Router()

// basic admin routes
router.route('/register').post(registerAdmin)
router.route('/login').post(loginAdmin)
router.route('/verify').post(verifyAdminEmail)
router.route('/fetch-admin').get(verifySuperAdmin, fetchAdmin)
router.route('/disable/:identifier').patch(verifySuperAdmin, disableAdmin)
router.route('/enable/:identifier').patch(verifySuperAdmin, enableAdmin)
router.route('/change-password/:email').patch(verifySuperAdmin, changePassword)
router.route('/admin-list').get(verifySuperAdmin, getAllAdmins)

// users controll routes
router.route('/get-users').get(verifySuperAdmin, getAllUser)
router.route('/disable-user/:identifier').patch(verifySuperAdmin, disableUser)
router.route('/enable-user/:identifier').patch(verifySuperAdmin, enableUser)

// withdrawal routes
router.route("/add-fund").post(verifySuperAdmin, addAmountInUserWallet)
router.route('/get-withdrawal-req').get(verifySuperAdmin, getAllWithdrawalReq)
router.route("/update-withdrawal").post(verifySuperAdmin, updateWithdrawalStatus)

// admin settings routes
router.route('/update-settings').post(verifySuperAdmin, addOrUpdateSettings)
router.route('/get-settings').get(verifySuperAdmin, getSettings)
router.route('/update-direct-referral').patch(verifySuperAdmin, updateDirectReferralReturnRate)
router.route('/update-referral-commission').patch(verifySuperAdmin, updateReferralCommissionRates)
router.route('/update-weekly-return').patch(verifySuperAdmin, updateWeeklyReturnRate)

// investments
router.route("/get-investments").get(verifySuperAdmin, getAllInvestments)

// run schedule tasks
router.route('/run-schedule').post(verifySuperAdmin, triggerScheduledTasks)



router.route("/add-promotion").post(
    upload.fields([
        { name: "coverImage", maxCount: 1 }
    ]),
    addPromotion)

router.route("/get-promotions").get(verifySuperAdmin, getPromotionList)


module.exports = router