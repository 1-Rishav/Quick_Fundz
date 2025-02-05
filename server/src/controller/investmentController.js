const connectPostgresDB = require("../db/index");
const asyncHandler = require("../utils/asyncHandler");

let pool;
(async () => {
    pool = await connectPostgresDB();
})();


exports.createInvestment = asyncHandler(async (req, res,next ) => {
    
    
    const { amount, duration, interestRate, userId} = req.body;
    try {
        const user = await pool.query("Select * from users where id=$1",[userId])
        const name = user.rows[0].name;
        const email = user.rows[0].email;
        const newInvestment = await pool.query(
            "INSERT INTO investor_details (name,email,amount, duration, rate_of_interest, user_id) VALUES ($1, $2, $3, $4 , $5 , $6) RETURNING *",
            [name , email,amount, duration, interestRate, userId]
        );
        const updateUsersInvestorUser_id= await pool.query("Update users set investor_usersuser_id=$1 where id=$2",[userId,userId])

       return res.status(201).json({
            status: 'success',
            message: 'Investment successfull',
            data: newInvestment.rows[0],
        });
    } catch (error) {
        console.error(error);
       return res.status(500).json({
            status: 'error',
            message: 'Investment failed',
            error: error.message,
        });
    }
});

exports.getAllInvestments = asyncHandler(async (req, res) => {
    const {userId} = req;
    try {
        const investments = await pool.query(
            "SELECT * FROM investor_details WHERE invest_status = $1 AND user_id != $2",['provider',userId] 
        );
        const liveLoan = investments.rows
       return res.status(200).json({
            status: "success",
            message:"Fetched all live loans",
            liveLoan,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error fetching loans",
            error: error.message,
        });
    }
});
exports.getUserLendAmount = asyncHandler(async (req, res) => {
    const {userId} = req;
    try {
        const investments = await pool.query(
            "SELECT * FROM investor_details WHERE  user_id = $1",[userId] 
        );
        res.status(200).json({
            status: "success",
            message:"Fetched your investment",
            data: investments.rows,
        });
    } catch (error) {
        console.error("Error fetching investments:", error);
        res.status(500).json({
            status: "error",
            message: "Error fetching investments",
            error: error.message,
        });
    }
});
