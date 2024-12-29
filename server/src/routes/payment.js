const express = require('express')
const router = express.Router();
const paymentController = require('../controller/paymentController')
// router.get('/loanPay',paymentController.loanPayment)
// router.post('/verify',paymentController.Verify)
router.post('/orderCreation',paymentController.order)
router.post('/payingMoney',paymentController.Verify)
module.exports = router;