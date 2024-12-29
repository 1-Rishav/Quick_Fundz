const express = require('express');
const loanController = require('../controller/loanController')
const authenticate = require('../middleware/authenticate.middleware')
const router = express.Router();

router.post('/loanAccepted', loanController.acceptedLoan);
router.post('/loan', loanController.requestLoan);
router.post("/requestInvestor", loanController.requestInvestor);
router.post("/rejectLoan", loanController.rejectedLoan);
router.post("/acceptLoan", loanController.acceptLoan);
router.post("/lastNegotiate", loanController.lastNegotiate);
router.post("/paidStatus", loanController.paidStatus);
router.get("/repayStatus", authenticate,loanController.repayStatus);
router.post("/moneyRepay", loanController.moneyRepaid);

module.exports = router;
