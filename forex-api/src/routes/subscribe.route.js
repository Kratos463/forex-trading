const {Router} = require("express")
const { subscribe } = require("../controllers/subscribe.controller")

const router = Router()

router.route("/").post(subscribe)

module.exports = router