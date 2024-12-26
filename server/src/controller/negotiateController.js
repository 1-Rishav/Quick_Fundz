const connectPostgresDB = require("../db/index");
const asyncHandler = require("../utils/asyncHandler")
const filterObj = require("../utils/filterObj")

let pool;
(async () => {
    pool = await connectPostgresDB();
})();

exports.negotiateAmount = asyncHandler(async (req, res) => {
    const { userId } = req;
    try {
        const allData = await pool.query('Select * from investor_negotiation where loan_user_id =$1 AND negotiate_status!=$2', [userId, 'Rejected']);
        const finalAmount = allData.rows;

        res.status(200).json({
            finalAmount,
        })
    } catch (error) {
        console.log(error);
    }
})

exports.negotiationApprove = asyncHandler(async (req, res) => {
    const { negotiateId, status, loanId, negotiateAmount, negotiateDuration, negotiateROI, pay_status } = req.body;
    try {
        const updateNegotiateUser = await pool.query("Update investor_negotiation set negotiate_status=$1 where id=$2", [status, negotiateId])
        const updateLoanDetail = await pool.query("Update loan_request_details set state=$1,loan_amount=$2,duration=$3,rate_of_interest=$4, pay_status=$5 where id=$6", [status,negotiateAmount, negotiateDuration,negotiateROI, pay_status, loanId])
    } catch (error) {
        console.log(error);
    }
});

exports.negotiationReject = asyncHandler(async (req, res) => {
    const { negotiateId, loanId, status } = req.body;
    try {
        const updateNegotiateUser = await pool.query("Update investor_negotiation set negotiate_status=$1 where id=$2", [status, negotiateId])
        const updateLoanDetail = await pool.query("Update loan_request_details set state=$1,pay_status=$2 where id=$3", [status, status, loanId])

    } catch (error) {
        console.log(error)
    }
});