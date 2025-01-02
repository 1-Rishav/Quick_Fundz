const connectPostgresDB = require("../db/index");
const asyncHandler = require("../utils/asyncHandler")
const filterObj = require("../utils/filterObj")
var corn = require('node-cron');

let pool;
(async () => {
    pool = await connectPostgresDB();
})();

exports.acceptedLoan = asyncHandler(async (req, res) => {
    const { investorId,investorUserId,investorAmount,investorDuration,investorRate,investorEmail,user_id,status } = req.body;
    const filteredBody = filterObj(req.body, 'investorId', 'investorUserId', 'investorAmount', 'investorDuration', 'investorRate', 'user_id', 'status','investorEmail');
    const user = await pool.query("Select * from users where id=$1", [user_id])
    const name = user.rows[0].name;
    const email = user.rows[0].email;
    const investorStatus = await pool.query("UPDATE investor_details SET invest_status = $1 WHERE id = $2", [status, investorId]);
    const loanRequest = await pool.query(
        "INSERT INTO loan_request_details (name, loan_amount, duration, user_id, rate_of_interest, email, investor_email, investoruser_id, original_amount, original_duration, original_rate_of_interest,investor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)",
        [name, filteredBody.investorAmount, filteredBody.investorDuration, filteredBody.user_id, filteredBody.investorRate, email, filteredBody.investorEmail, filteredBody.investorUserId, filteredBody.investorAmount, filteredBody.investorDuration, filteredBody.investorRate, investorId]

    );
    const updateLoanUser_id = await pool.query("Update users set loan_usersuser_id=$1 where id=$2", [user_id, user_id])

})
exports.requestLoan = asyncHandler(async (req, res) => {
    const { userId, loanAmount, loanDuration, loanUserId, loanInterestRate, investorEmail, investorUserId, status, investorAmount, investorDuration, investorRate } = req.body;
    const filteredBody = filterObj(req.body, 'loanAmount', 'loanDuration', 'loanUserId', 'loanInterestRate', 'investorEmail', 'investorUserId', 'status', 'investorAmount', 'investorDuration', 'investorRate');
    const user = await pool.query("Select * from users where id=$1", [loanUserId])
    const name = user.rows[0].name;
    const email = user.rows[0].email;
    const investorStatus = await pool.query("UPDATE investor_details SET invest_status = $1 WHERE id = $2", [status, userId]);
    const loanRequest = await pool.query(
        "INSERT INTO loan_request_details (name, loan_amount, duration, user_id, rate_of_interest, email, investor_email, investoruser_id, original_amount, original_duration, original_rate_of_interest,investor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)",
        [name, filteredBody.loanAmount, filteredBody.loanDuration, filteredBody.loanUserId, filteredBody.loanInterestRate, email, filteredBody.investorEmail, filteredBody.investorUserId, filteredBody.investorAmount, filteredBody.investorDuration, filteredBody.investorRate, userId]

    );
    const updateLoanUser_id = await pool.query("Update users set loan_usersuser_id=$1 where id=$2", [loanUserId, loanUserId])

})

exports.requestInvestor = asyncHandler(async (req, res) => {
    const { investorUserId } = req.body;

    const userLoanRequest = await pool.query("SELECT * from loan_request_details where investoruser_id=$1 AND state!=$2 ", [investorUserId, 'Rejected'])

    const loanTaker = userLoanRequest.rows
    //const loan_status=userLoanRequest.rows[0].state;

    res.status(200).json({
        loanTaker
    })
})

exports.rejectedLoan = asyncHandler(async (req, res) => {
    const { status, userId, loanId } = req.body;
    const updateLoanRequest = await pool.query("UPDATE loan_request_details SET state=$1,pay_status=$2 where id=$3 ", [status, status, loanId])
    const updateInvestor = await pool.query("Update investor_details Set invest_status=$1 where id=$2", ['provider', userId])

})

exports.acceptLoan = asyncHandler(async (req, res) => {
    const { status, userId, loanId, pay_status } = req.body;
    const updateLoanRequest = await pool.query("UPDATE loan_request_details SET state=$1,pay_status=$2 where id=$3 ", [status, pay_status, loanId])
    //const updateInvestor = await pool.query("Update investor_details Set invest_status=$1 where id=$2", ['paid', userId])
});

exports.lastNegotiate = asyncHandler(async (req, res) => {
    const { investor_email, investoruser_id, negotiateAmount, negotiateDuration, negotiateInterestRate, loan_amount, loan_duration, loanInterestRate, loanUserId, loanId } = req.body;
    const filteredBody = filterObj(req.body, 'investor_email', 'investoruser_id', 'negotiateAmount', 'negotiateDuration', 'negotiateInterestRate', 'loan_amount', 'loan_duration', 'loanInterestRate', 'loanUserId', 'loanId')
    const user = await pool.query("SELECT * FROM users where id=$1", [investoruser_id])
    const name = user.rows[0].name;
    const insertNegotiateRequest = await pool.query("INSERT INTO investor_negotiation (name,email,user_id,negotiate_amount,negotiate_duration,negotiate_rate_of_interest,loan_amount,loan_duration,loan_rate_of_interest,loan_user_id,loan_id) Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [name, filteredBody.investor_email, filteredBody.investoruser_id, filteredBody.negotiateAmount, filteredBody.negotiateDuration, filteredBody.negotiateInterestRate, filteredBody.loan_amount, filteredBody.loan_duration, filteredBody.loanInterestRate, filteredBody.loanUserId, filteredBody.loanId])
    const updateLoanRequstDetails = await pool.query("Update loan_request_details set original_amount=$1 , original_duration=$2 ,original_rate_of_interest=$3 where investoruser_id=$4", [filteredBody.negotiateAmount, filteredBody.negotiateDuration, filteredBody.negotiateInterestRate, filteredBody.investoruser_id])
})

exports.paidStatus = asyncHandler(async (req, res) => {
    const { investorId, invest_status, loan_status, duration } = req.body;
    try {
        const updateInvestorStatus = await pool.query('Update investor_details set invest_status=$1 where id=$2', [invest_status, investorId])
        const updateLoanRequestDetails = await pool.query('Update loan_request_details set pay_status=$1,payment_time=$2,repayment_time=$3 where investor_id=$4 RETURNING *', [loan_status, new Date(Date.now()), new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() + duration)), investorId])

        const updatedLoanRequest = updateLoanRequestDetails.rows[0];
        const investorNameDetail = await pool.query('Select name from investor_details where id=$1', [updatedLoanRequest.investor_id])
        const investorName = investorNameDetail.rows[0].name;
        const loan_amount = updatedLoanRequest.original_amount;
        const loan_duration = updatedLoanRequest.original_duration;
        const loan_ROI = updatedLoanRequest.original_rate_of_interest;
        const repay_user = updatedLoanRequest.user_id;
        const provider_user = updatedLoanRequest.investoruser_id;
        const startDate = updatedLoanRequest.payment_time;
        const endDate = updatedLoanRequest.repayment_time;
        let Amount = parseInt(loan_amount.replace('₹', '').replace(/\s+/g, ''));
        let Duration = parseInt(loan_duration.replace('month', '').replace(/\s+/g, ''));
        let Anual_duration = Duration / 12
        let ROI = parseInt(loan_ROI.replace('%', '').replace(/\s+/g, ''));
        let interest = (Amount * Anual_duration * ROI) / 100;
        let total_amount = Math.ceil(Amount + interest);
        let remainDays = endDate - startDate;
        const days = remainDays / (1000 * 60 * 60 * 24);
        const insertLoanRepaymentData = await pool.query('Insert into loan_repayment (name,loan_amount,loan_duration,loan_roi,interest_amount,remain_days,repayment_user_id,provider_user_id) values ($1,$2, $3,$4,$5,$6,$7,$8)', [investorName, loan_amount, loan_duration, loan_ROI, total_amount, days, repay_user, provider_user])
        const updateUserId = await pool.query('Update users set repayment_usersuser_id = $1 where id=$2', [repay_user, repay_user])

        return res.status(200).json({
            status: 200,
            message: 'Payment Successful'
        })
    } catch (error) {
        console.log(error);
    }
})

exports.repayStatus = asyncHandler(async (req, res) => {
    const { userId } = req
    try {
        const RepayData = await pool.query('Select * from loan_repayment where repayment_user_id = $1', [userId])
        const repayData = RepayData.rows
        res.status(200).json(repayData)
    } catch (error) {
        console.log(error);
    }
})

exports.moneyRepaid = asyncHandler(async (req, res) => {
    const { pay_id, paid_status } = req.body;
    try {
        const updateRepayment = await pool.query('Update loan_repayment set payment_status = $1 paid_time = $2 where id=$3', [paid_status, new Date(Date.now()), pay_id])
    } catch (error) {
        console.log(error);
    }
})

exports.borrowRequest = asyncHandler(async (req, res) => {
    const {email, amount, duration, interestRate,userId} = req.body;
    if(email.trim().length==0 || amount.trim().length==0 || interestRate.trim().length==0 || duration.trim().length==0){
        return res.status(404).json({
            message:"Fill all credential"
        })
    }
    try {
        const fetchName = await pool.query('Select name from users where id=$1',[userId])
        const name = await fetchName.rows[0].name;
        const insertpreLoanRequest = await pool.query('Insert into loanpre_request  (name,email ,amount , duration , rate_of_interest,user_id) values($1,$2,$3,$4,$5,$6)',[name,email,amount,duration,interestRate,userId])
    } catch (error) {
        console.log(error)
    }
})

corn.schedule('0 0 * * *', async () => {
    try {
        console.log('Running daily task: Decreasing remaining days...');
        await pool.query('UPDATE loan_repayment SET remain_days = remain_days - 1 WHERE remain_days > 0;');
        await pool.query('UPDATE loan_repayment SET enable_pay=$1 WHERE remain_days =$2', [true, 25])
        console.log('Task completed successfully.');
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
});