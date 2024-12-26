const router = require("express").Router();
const user = require('./user');
const userKYC = require('./userKYC');
const admin = require('./admin');
const investment = require('./investmentRoutes'); 
const loan = require('./loanRoutes')
const negotiation = require('./negotiation')
const payment = require('./payment')
router.use("/auth", user);
router.use("/auth", userKYC);
router.use("/admin", admin);
router.use("/investments", investment);
router.use("/loanRequest",loan);
router.use("/negotiateRequest",negotiation);
router.use("/paymentRequest",payment);
//router.use("/negotiateRequest",negotiation);


module.exports = router;
