const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectPostgresDB = require("../db/index");
const asyncHandler = require("../utils/asyncHandler")
const filterObj = require("../utils/filterObj")
const otpGenerator = require("otp-generator");
const mailService = require("../services/mailer.js");
const crypto = require("crypto");
const otp = require("../Templates/Mail/otp.js");
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let pool;
(async () => {
  pool = await connectPostgresDB();
})();

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, username, email, password } = req.body;

  // Filter the body to include only necessary fields
  const filteredBody = filterObj(req.body, "fullName", "username", "email", "password");

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      if (!userExists.rows[0].verified) {
        req.userId = userExists.rows[0].id;
        return next()
      } else {
        return res.status(400).json({ error: "User already exists" });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (name,username, email, password) VALUES ($1, $2, $3,$4)",
        [filteredBody.fullName, filteredBody.username, filteredBody.email, hashedPassword]
      );
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      const user_id = user.rows[0].id;
      //      const role = user.rows[0].role     
      //     const verificationStatus=user.rows[0].is_verified;
      //     const token = jwt.sign(
      //       { userId: user.rows[0].id },
      //       process.env.JWT_SECRET,
      //       { expiresIn: "1y" }
      //     );
      //     const options = {
      //       httpOnly: true,
      //       secure: process.env.NODE_ENV === 'production',
      //       sameSite: "strict", 
      // maxAge: 360000 * 24 * 60 * 60 * 1000,
      //   }
      //     res.cookie("token",token,options).status(201).json({ message: "User registered successfully" ,role,user_id,verificationStatus});
      req.userId = user_id;
      next();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error occured while registering user" });
  }
})

exports.sendOTP = asyncHandler(async (req, res, next) => {
  const { userId } = req;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required to send OTP" });
  }
  // Generate OTP
  try {
    const new_otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const otp_expiry_time = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Update user in PostgreSQL
    const updateQuery = `
      UPDATE users
      SET otp = $1, otp_expiry_time = $2
      WHERE id = $3
      RETURNING id, email,name;
    `;

    const values = [new_otp, otp_expiry_time, userId];
    const { rows } = await pool.query(updateQuery, values);

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const user = rows[0];
    console.log(new_otp);

    // TODO: Send email
    mailService.sendEmail({
      from: "gemxai5@gmail.com",
      to: user.email,
      subject: "Verification OTP",
      html: otp(user.name, new_otp),
      attachments: [],
    });

    return res.status(200).json({
      status: "success",
      message: "OTP Sent Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error sending OTP"
    })
  }
});

exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  // Find user by email and ensure OTP is valid
  const findQuery = `
    SELECT id, otp, otp_expiry_time, verified
    FROM users
    WHERE email = $1 AND otp_expiry_time > $2;
  `;

  const findValues = [email, new Date()];
  const { rows } = await pool.query(findQuery, findValues);

  if (rows.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  const user = rows[0];

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  // OTP is correct; update user to mark as verified
  const updateQuery = `
    UPDATE users
    SET verified = $1, otp = NULL
    WHERE id = $2;
  `;

  const updateValues = [true, user.id];
  await pool.query(updateQuery, updateValues);

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1y" }
  );

  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   maxAge: 365 * 24 * 60 * 60 * 1000 * 100,
  //   sameSite: 'None',
  // };

  const options = {
    httpOnly: true,
    secure: true /* process.env.NODE_ENV === 'production' */,
    sameSite: "None",
    maxAge: 360000 * 24 * 60 * 60 * 1000,
  }

  return res.cookie("token", token, options).status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user.id,
  });
});



exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "No user found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const kycUser = await pool.query("Select * from user_kyc_details WHERE email = $1", [email]);
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );
    const options = {
      httpOnly: true,
      secure:true /* process.env.NODE_ENV === 'production' */,
      sameSite: "None",
      maxAge: 360000 * 24 * 60 * 60 * 1000,
    }
    const kycMessage = kycUser.rows[0]?.message;
    const role = user.rows[0].role;
    const user_id = user.rows[0].id;
    const docs_status = user.rows[0].docs_status;
    const verificationStatus = user.rows[0].is_verified;
    const verified = user.rows[0].verified;
    return res.cookie("token", token, options).status(201).json({
      message: "Loggedin successfully", token, role, user_id, verificationStatus, kycMessage, verified, docs_status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

exports.incomeDocuments = asyncHandler(async (req, res) => {
  const { userId } =await req
  console.log(req.file);
  const fileOriginal =await req.file.originalname;
console.log(fileOriginal)
console.log(userId);
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw', // only for files 
      folder: 'Quick_Fundz_docs',
      use_filename: true,   // Use the original filename
      unique_filename: false,
      access_mode: 'public',
      format: 'pdf',
    });

    const fileUrl = result.secure_url;
    console.log(fileUrl);
    const publicId = result.public_id;
    console.log(publicId);
    const extractName = await pool.query('Select name from users where id = $1', [userId]);
    const name = extractName.rows[0]?.name;
    const insertDocuemnts = await pool.query('Insert into incomebank_docs (name , user_id,file_name,file_url,cloudinary_id) values($1,$2,$3,$4,$5)', [name, userId, fileOriginal, fileUrl, publicId])
    const updateUserDocs = await pool.query('Update users set docs_status=$1 where id=$2', [true, userId])
    const updateKYCUser = await pool.query('Update user_kyc_details set document_file =$1 where user_id=$2', [fileUrl, userId])
    return res.status(200).json({ message: 'Documents successfully uploaded ' })
  } catch (error) {
    return res.status(500).json({ message: "Error uploading documents", })
  }
})

exports.changeProfile = asyncHandler(async (req, res) => {
  const { userId } =await req;
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    const existingAvatar = await pool.query('Select avatar_id from users where id=$1', [userId])
    const prevAvatar = existingAvatar?.rows[0]
    console.log(prevAvatar);
    if (prevAvatar?.avatar_id) {
      await cloudinary?.uploader?.destroy(prevAvatar?.avatar_id, {
        resource_type: 'image',
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'image', // only for images 
      folder: 'Quick_Fundz_avatars',
      use_filename: true,   // Use the original filename
      unique_filename: false,
      access_mode: 'public',

    });

    const fileUrl = result.secure_url;
    const publicId = result.public_id;
    console.log(publicId)
    const updateUserAvatar = await pool.query('Update users set avatar_url = $1,avatar_id=$2 where id=$3 RETURNING avatar_url', [fileUrl, publicId, userId])

    const avatar = updateUserAvatar.rows[0].avatar_url

    return res.status(200).json({ status: 'success', message: 'Avatar changed successfully', avatar })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: "Error updating avatar" });
  }
})

exports.changeUserAvatar = asyncHandler(async (req, res) => {
  const { userId } = req;

  try {
    const showAvatar = await pool.query('Select avatar_url from users where id = $1', [userId])
    const avatar = showAvatar.rows[0]?.avatar_url;
    return res.status(200).json({ status: 'success', message: 'Avatar changed successfully', avatar })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: "Error updating avatar" });
  }

})

exports.getDetail = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const userDetail = await pool.query('Select * from users where id = $1', [userId])
    const userAvatar = userDetail.rows[0]?.avatar_url
    const userName = userDetail.rows[0]?.name;
    const userEmail = userDetail.rows[0]?.email;
    const verified = userDetail.rows[0]?.is_verified;
    const startDate = userDetail.rows[0]?.otp_expiry_time;
    const endDate = new Date();
    //console.log(endDate);
    let yearsDiff = endDate.getFullYear() - startDate?.getFullYear();
    let monthsDiff = endDate.getMonth() - startDate?.getMonth();
    let daysDiff = endDate.getDate() - startDate?.getDate();

    // Convert the year and month difference to total months
    let totalMonths = yearsDiff * 12 + monthsDiff;

    // Adjust if days are negative (i.e., the end date is before the same day of the next month)
    if (daysDiff < 0) {
      totalMonths -= 1;
    }
    // console.log(totalMonths)
    const loanDetail = await pool.query('Select * from loan_request_details where user_id=$1 ', [userId]);
    const userLoan = loanDetail.rows;
    const repayPaidDetail = await pool.query('Select * from loan_repayment where repayment_user_id=$1 AND payment_status=$2', [userId, 'Paid']);
    const userPaid = repayPaidDetail.rows;
    const repayNotPaidDetail = await pool.query('Select * from loan_repayment where repayment_user_id=$1 AND payment_status=$2', [userId, 'Not-paid']);
    const userNotPaid = repayNotPaidDetail.rows;
    const investorDetail = await pool.query('Select * from investor_details where user_id=$1 ', [userId]);
    const userInvestment = await investorDetail.rows;
    //console.log(userAvatar,userEmail,userName,verified , userLoan , userPaid,userNotPaid,userInvestment);
    return res.status(200).json({
      message: 'User Detail fetched successfully', userAvatar, userEmail, userName, verified, totalMonths, userLoan, userPaid, userNotPaid, userInvestment
    })
  } catch (error) {
    console.log(error);
  }
})
/* router.get("/me", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userId: verified.userId });
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}); */