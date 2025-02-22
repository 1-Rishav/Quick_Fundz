const connectPostgresDB = require("../db/index");
const asyncHandler = require("../utils/asyncHandler")
const filterObj = require("../utils/filterObj")

let pool;
(async()=>{
    pool = await connectPostgresDB();
})();

exports.showKycRequest=asyncHandler(async(req,res)=>{
    try {
      const pendingKyc = await pool.query("Select * from user_kyc_details where is_verified=$1",['pending'])
      const listOfRequest = pendingKyc.rows
      return res.status(200).json({message:'Fetched all request',
          listOfRequest
      })
    } catch (error) {
      return res.status(500).json({message:'Fetching request failed'});
    }
    
})

exports.confirm_OR_Reject_user=asyncHandler(async(req,res)=>{
    const {status,userId,usersId,message} = req.body;
    console.log(req.body);
    try {
        const userStatus= await pool.query("UPDATE user_kyc_details SET is_verified = $1,message=$2 WHERE id = $3",[status,message,userId]);
        const updateUser= await pool.query("UPDATE users SET is_verified = $1 WHERE id = $2",[status,usersId])

        return res.status(200).json({
message:'Status updated successfully'
        })
    } catch (error) {
        return res.status(404).json({message:'Updation error'})
    }
})

exports.getAllKycDetails = async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM user_kyc_details`
      );
      const kycDetail = result.rows
     return res.json({ message:'Fetched KYC details' , kycDetail});
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching KYC details' });
    }
  };

  exports.adminUpdateKycUser=asyncHandler(async(req,res)=>{
    const {userId,userID} = req.body;
    console.log(userId , userID)
try {
      const updateKycUser= await pool.query('Update user_kyc_details set user_id = NULL where id=$1',[userId])
      const updateUserKyc= await pool.query('Update users set kyc_usersuser_id=NULL where id=$1',[userID])
      return res.status(200).json({message:'user_id updated successfully'})
} catch (error) {
  return res.status(404).json({message:'Error updating user_id'})
}  })

exports.getAllUsers=asyncHandler(async(req,res)=>{

  try {
    const allUser = await pool.query('Select * from users ')
    const users = allUser.rows
   return res.status(200).json({message:'Fetched all users',users})
  } catch (error) {
  return res.status(500).json({ message: 'Error fetching user details' });
  }
});

exports.adminUpdateUser=asyncHandler(async(req,res)=>{
  const {userId,inputValue}=req.body;

try {
    const updateUser = await pool.query("Update users set message=$1 where id=$2",[inputValue,userId])
    return res.status(200).json({message:'Message sent '});
} catch (error) {
  return res.status(404).json({message:'Error sending message'})
}})
exports.deleteUser = async (req, res) => {
  const {userId} = req.body
  
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
   return res.json({ message: 'User deleted successfully' });
  } catch (error) {
   return res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.adminMessage=asyncHandler(async(req, res)=>{
  const {userId} = req;
  try {
    const message = await pool.query('Select message from users where id=$1',[userId])

    res.status(200).json(message.rows[0].message);
  } catch (error) {
    console.log(error)
  }
})

/* exports.adminMessageDelete=asyncHandler(async(req, res)=>{
  const {userId} = req;
  try {
    const deleteMessage = await pool.query("Update users set message=NULL where id=$1",[userId])
  } catch (error) {
    console.log(error)
  }
}) */

  exports.allInvestorDetails=asyncHandler(async(req, res)=>{
    try {
      const allInvestor = await pool.query('Select * from investor_details ')
      const investorDetail = allInvestor.rows
      return res.status(200).json({message:'Fetched investor details',investorDetail})
    } catch (error) {
       return res.status(500).json({ message: 'Error fetching investor details' });
    }
  })

  exports.allLoanRequest=asyncHandler(async(req,res)=>{
    try {
      const allLoanRequest = await pool.query('Select * from loan_request_details ')
      const loanDetail=allLoanRequest.rows
     return res.status(200).json({message:'Fetched loan details',loanDetail})
    } catch (error) {
     return res.status(500).json({ message: 'Error fetching loan details' });
    }
  })

  exports.updateInvestorUser=asyncHandler(async(req,res)=>{
    const {userId , userID}= req.body;
    try {
      const UpdateInvestor = await pool.query('Update investor_details set user_id=NULL where id=$1',[userId])
      const updateInvestorUser= await pool.query('Update users set investor_usersuser_id=NULL where id=$1',[userID])
      return res.status(200).json({message: 'Investor user_id updated successfully'})
    } catch (error) {
      return res.status(404).json({message:'Error updating user_id'});
    }
  })

  exports.updateLoanUser= asyncHandler(async(req,res)=>{
    const {userId,userID} = req.body;
    try {
      const UpdateLoanRequest = await pool.query('Update loan_request_details set user_id=NULL where id=$1',[userId])
      const updateLoanRequestUser= await pool.query('Update users set loan_usersuser_id=NULL where id=$1',[userID])
        return res.status(200).json({message:'LoanRequest user_id updated successfully'})
        } catch (error) {
        return res.status(404).json({message:'Error updating user_id'});
    }
  })

  exports.negotiationData = asyncHandler(async(req,res)=>{
    try {
      const negotiationData = await pool.query('Select * from investor_negotiation')
      const negotiateDetail = negotiationData.rows
      return res.status(200).json({message:'Fetched all negotiation detail',negotiateDetail})
      
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching negotiation details' });
    }
  })

  exports.updateNegotiationUser = asyncHandler(async(req,res)=>{
    const {userId,userID} = req.body;
    try {
      const updateNegotiationUser = await pool.query('Update investor_negotiation set user_id=NULL where id=$1',[userId])
      const updateLoanRequestUser= await pool.query('Update users set negotiate_usersuser_id=NULL where id=$1',[userID])
      return res.status(200).json({ message: 'Negotiation user_id updated successfully'});
    } catch (error) {
      return res.status(404).json({message:'Error updating user_id'})
    }
  })

  exports.allRepaymentData = asyncHandler(async(req,res)=>{
    try {
      const repaymentData = await pool.query('Select * from loan_repayment')
      const repaymentDetail= repaymentData.rows;
     return res.status(200).json({message:'Fetched repayment details',repaymentDetail})
    } catch (error) {
      //console.error('Error fetching User details:', error);
       return res.status(500).json({ message: 'Error fetching repayment details' });
    }
  })

  exports.updateRepaymentUser = asyncHandler(async(req,res)=>{
    const {userId,userID} = req.body;
    try {
      const updateRepaymentUser = await pool.query('Update loan_repayment set repayment_user_id=NULL where id=$1',[userId])
      const updateLoanRequestUser= await pool.query('Update users set repayment_usersuser_id=NULL where id=$1',[userID])
      return res.status(200).json({ message: 'Repayment user_id updated successfully'})
    } catch (error) {
      return res.status(500).json({message:'Error updating user_id'});
    }
  })