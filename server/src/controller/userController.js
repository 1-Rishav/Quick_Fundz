const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectPostgresDB = require("../db/index");
const asyncHandler= require("../utils/asyncHandler")
const filterObj = require("../utils/filterObj")
const otpGenerator = require("otp-generator");
const mailService = require("../services/mailer.js");
const crypto = require("crypto");
const otp = require("../Templates/Mail/otp.js");

 let pool;
 (async()=>{
  pool = await connectPostgresDB();
 })();
 
exports.registerUser = asyncHandler(async(req, res, next)=>{
    const { fullName,username, email, password } = req.body;
    
    // Filter the body to include only necessary fields
  const filteredBody = filterObj(req.body,"fullName", "username", "email", "password");

  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name,username, email, password) VALUES ($1, $2, $3,$4)",
      [filteredBody.fullName , filteredBody.username, filteredBody.email, hashedPassword]
    );
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    
    const role = user.rows[0].role
    const user_id=user.rows[0].id; 
    const verificationStatus=user.rows[0].is_verified;
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "360000h" }
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
  }
    res.cookie("token",token,options).status(201).json({ message: "User registered successfully" ,role,user_id,verificationStatus});
    req.userId = user_id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
})

exports.sendOTP = asyncHandler(async (req, res, next) => {
  const { userId } = req;

  // Generate OTP
  try {
    const new_otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  
    const otp_expiry_time = new Date(Date.now() + 5 * 60 * 1000); // 10 minutes from now
  
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
      return next(new AppError('User not found', 404));
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
    console.log(error)
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
    { expiresIn: "360000h" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 365 * 24 * 60 * 60 * 1000 * 100,
    sameSite: 'None',
  };

  return res.cookie('user', { id: user.id, email }, cookieOptions).status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user.id,
  });
});



exports.loginUser= asyncHandler(async(req,res)=>{
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
      const kycUser = await pool.query("Select * from user_kyc_details WHERE email = $1",[email]);
      const token = jwt.sign(
        { userId: user.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "360000h" }
      );
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
  const kycMessage = kycUser.rows[0]?.message;
  const role = user.rows[0].role;
  const user_id=user.rows[0].id;
  const verificationStatus=user.rows[0].is_verified;
  const verified = user.rows[0].verified;
      res.cookie("token",token,options).status(201).json({ token, role , user_id,verificationStatus,kycMessage,verified});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
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