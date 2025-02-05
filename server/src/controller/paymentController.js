//const {Cashfree} = require('cashfree-pg')

// Cashfree.XClientId = process.env.CLIENT_ID
//     Cashfree.XClientSecret = process.env.CLIENT_SECRET;
//     Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// function generateOrderId(){
//     const uniqueId = crypto.randomBytes(16).toString('hex');
//     const hash = crypto.createHash('sha256');
//     hash.update(uniqueId);

//     const orderId = hash.digest('hex');
//     return orderId.substring(0,12);
// }

// const asyncHandler = require("../utils/asyncHandler");

// exports.loanPayment=asyncHandler(async(req, res)=>{
//     try {
//         var request = {
//             "order_amount": "1",
//             "order_currency": "INR",
//             "order_id":await generateOrderId(),
//             "customer_details": {
//               "customer_id": "node_sdk_test",
//               "customer_name": "",
//               "customer_email": "example@gmail.com",
//               "customer_phone": "9999999999"
//             },
//         }

//         const response = await Cashfree.PGCreateOrder("2023-08-01", request);
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error('Error creating order:', error.response?.data || error.message);
//         res.status(error.response?.status || 500).json({ error: "Failed to create order", details: error.response?.data });
//     }
// })

// exports.Verify = asyncHandler( async (req, res) => {
//     const { orderId } = req.body;

//     if (!orderId) {
//         return res.status(400).json({ error: "Missing orderId" });
//     }

//     try {
//         const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
//         if (!response.data) {
//             return res.status(404).json({ error: "Order not found" });
//         }
       
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error("Error verifying order:", error.response?.data || error.message);
//         res.status(error.response?.status || 500).json({ error: "Failed to verify order", details: error.response?.data });
//     }
// });

const Razorpay = require('razorpay')
const asyncHandler = require('../utils/asyncHandler')
const crypto = require('crypto')

const razorpay = new Razorpay({
    key_id:process.env.RAZOR_KEY_ID,
    key_secret:process.env.RAZOR_KEY_SECRET
})

exports.order = asyncHandler(async(req,res)=>{
    const {amount} = req.body;
    
    try {
        const options = {
            amount:Number(amount *100),
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex"),
        }
        razorpay.orders.create(options,(err,order)=>{
            if(err){
                console.log(err);
                return res.status(500).json({message:"Something went wrong! "})
            }
            
           return res.status(200).json({message:"Order created",data:order})
        })
    } catch (error) {
        return res.status(500).json({message:"Error creating order"});
    }

})

exports.Verify=asyncHandler(async(req,res)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // console.log("req.body", req.body);

    try {
        // Create Sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.RAZOR_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // console.log(razorpay_signature === expectedSign);

        // Create isAuthentic
        const isAuthentic = expectedSign === razorpay_signature;

        // Condition 
        if (isAuthentic) {
            const payment = {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            };
           return res.status(200).json({
                message:"Payment Successful"
            })
            
        }
    } catch (error) {
       return res.status(500).json({ message: "Internal Server Error!" });
    }

})

