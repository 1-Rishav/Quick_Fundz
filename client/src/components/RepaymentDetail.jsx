import React, { useEffect, useState } from 'react'
import { createOrder, moneyRepayment, payingMoney, screenRepayment } from '../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import Model from './Modal';
import { useDisclosure } from '@heroui/modal';
import CustomButton from './UI/CustomButton';

function RepaymentDetail() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userid, setuserid] = useState(null);

  const [repayLoanStatus, setRepayLoanStatus] = useState(null);
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const params = useParams();
  const { id } = params;

  const fetchRepayStatus = async () => {

    const data = { id, user_id }
    try {
      const repayment = await dispatch(screenRepayment(data));
      setRepayLoanStatus(repayment.repayData);

    } catch (error) {
      console.error("Error fetching KYC requests: ", error);
    }
  };

  useEffect(() => {

    fetchRepayStatus();

  }, [dispatch, user_id, id]);
  const handlePay = async (repay_amount, pay_id, paid_status) => {
    try {

      let amount = parseInt(repay_amount.replace('₹', '').replace(/\s+/g, ''));
      const data = {
        amount
      }
      const order = await dispatch(createOrder(data))
      handlePaymentVerify(order.data, pay_id, paid_status)
    } catch (error) {
      console.log(error);
    }
  }

  const handlePaymentVerify = async (data, pay_id, paid_status) => {
    const options = {
      key: import.meta.env.VITE_RAZOR_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Quick_Fundz',
      description: "Loan_Payment",
      order_id: data.id,
      handler: async (response) => {
        //console.log("response", response)
        try {
          const data = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
          const payment = await dispatch(payingMoney(data))

          const verifyData = await payment;
          console.log(verifyData);
          if (verifyData.message === "Payment Successful") {
            const data = {
              pay_id,
              paid_status
            }
            const pay_status = await dispatch(moneyRepayment(data))
            console.log(pay_status);
          }
          window.location.reload();
          await fetchRepayStatus();
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#5f63b8"
      }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }

  const handleModal = (id) => {
    setuserid(id);
  }
  return (
    <>
      <div className=' h-full w-full gradient-bg-transactions'>
        <div className='min-h-screen  h-full w-full  px-5 sm:px-7 md:px-10 lg:px-14 xl:px-16 4xl:px-20'>
          <div className='flex justify-center items-center h-fit mb-10 p-2 tracking-normal font-serif  text-xl md:text-3xl  font-bold text-neutral-100'>Detail</div>
          <div className="grid grid-cols-1 gap-4 gradient-bg-services  ">
            {repayLoanStatus?.map((user, index) => (
              <div key={index} className="border p-4 gradient-bg-services rounded-lg  flex max-md:flex-wrap gap-5 justify-between items-center">
                <motion.div className=" [perspective::1000px] [transform-style:preserve-3d] relative border p-4 rounded-lg flex flex-wrap h-fit justify-between items-center gap-2"

                  whileHover={{
                    rotateX: 10,
                    rotateY: -10,
                    //rgba(8,112,184,0.7)
                    boxShadow: `0px 10px 30px rgba(150, 200, 189, 0.888)`,
                    y: -6,
                  }}
                  whileTap={{
                    y: 0
                  }}
                  style={{
                    translateZ: 100,
                  }}
                  onClick={onOpen}
                  onClickCapture={() => handleModal(user.provider_user_id)}>
                  <div className="block w-full h-fit text-center text-xl text-gray-500 font-bold ">Money-Lender Credentials</div>
                  <div className="relative w-fit h-fit flex flex-wrap flex-col text-neutral-100">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Loan_Amount:</strong> {user?.loan_amount}</p>
                  </div>
                  <div className="relative w-fit h-fit flex flex-wrap flex-col gap-4 text-neutral-100">
                    <p><strong>Duration:</strong> {user?.loan_duration}</p>
                    <p><strong>Interest Rate:</strong> {user?.loan_roi}</p>
                  </div>
                </motion.div>
                <motion.div className="[perspective::1000px] [transform-style:preserve-3d] relative border p-4 rounded-lg w-fit h-fit flex flex-wrap justify-between items-center gap-2"

                  whileHover={{
                    rotateX: 10,
                    rotateY: -10,
                    //rgba(8,112,184,0.7)
                    boxShadow: `0px 10px 30px rgba(150, 200, 189, 0.888)`,
                    y: -6,
                  }}
                  whileTap={{
                    y: 0
                  }}
                  style={{
                    translateZ: 100,
                  }}
                  onClick={onOpen}
                  onClickCapture={() => handleModal(user.repayment_user_id)}>
                  <div className="block w-full h-fit text-center text-gray-500 text-xl font-bold ">Re-payment</div>
                  <div className=" flex flex-wrap w-fit h-fit flex-col gap-4 text-neutral-100">
                    <p><strong>Amount:</strong> {`₹ ${user?.interest_amount}`}</p>
                    <p><strong>Remain Days:</strong> {`${user?.remain_days} days`}</p>
                  </div>
                  <div className="w-fit h-fit flex flex-wrap flex-col gap-4 text-neutral-100">
                    <p><strong>Pay_Status:</strong> {user?.payment_status}</p>
                  </div>
                </motion.div>

                <div className="space-2 w-fit h-fit gap-2 flex flex-wrap md:flex-col justify-center">
                  {user.enable_pay === true ? (

                    user.payment_status === 'Paid' ? (
                      <button className="bg-gray-800 text-white px-4 py-2 rounded-lg cursor-not-allowed">Paid</button>
                    ) :
                      (
                        <>
                          <button className=" px-4 py-2 rounded-lg" onClick={() => handlePay(user.interest_amount, user.id, "Paid")} ><CustomButton button='Pay' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)'/></button>
                          {/* <p className="text-sm text-red-600 text-center">Pay within three days.<br/> Otherwise Your account will block.</p> */}
                        </>
                      )

                  ) : <button className="bg-gray-800 text-white px-4 py-2 rounded-lg cursor-not-allowed" >Pay</button>}

                </div>
              </div>
            ))}
          </div>

        </div>
        <Model isOpen={isOpen} onOpenChange={onOpenChange} userId={userid} />

      </div>
    </>
  )
}

export default RepaymentDetail