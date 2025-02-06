import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { GrDocumentPdf } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux';
import { approvedLoan, createOrder, investorNegotiate, moneyPaid, payingMoney, rejectedLoan, screenRequestLoan } from '../redux/slices/auth';
import NegotiateForm from './NegotiateForm'
function LoanDetail() {
  const [showLoanRequest, setShowLoanRequest] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [investor_email, setInvestor_email] = useState(null);
  const [investoruser_id, setInvestoruser_id] = useState(null);
  const [loan_amount, setLoan_amount] = useState(null);
  const [loan_duration, setLoan_duration] = useState(null);
  const [loanInterestRate, setLoanInterestRate] = useState(null);
  const [loanUserId, setLoanUserId] = useState(null);
  const [loanId, setLoanId] = useState(null);
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const params = useParams();
  const {id}=params;
  
  const fetchLoanRequests = async () => {
        
    const data={id,user_id}
    try {
      const loanRequestUser = await dispatch(screenRequestLoan(data));
      setShowLoanRequest(loanRequestUser.requestLoan);
      //setCountRequest(loanRequestUser.loanTaker.length)
    } catch (error) {
      console.error("Error fetching KYC requests: ", error);
    }
  };

  useEffect(() => {
  
      fetchLoanRequests();
  
    }, [dispatch, user_id,id]);
   

  const handleApprove = async(index, status, userId, loanId,pay_status) => {
      const data = {
        status: status,
        userId: userId,
        loanId: loanId,
        pay_status
      }
      dispatch(approvedLoan(data))
      await fetchLoanRequests()
    };
  
    const handleRejected = async(status, userId, loanId) => {
      const data = {
        status: status,
        userId: userId,
        loanId: loanId,
      };
      dispatch(rejectedLoan(data));
      await fetchLoanRequests();
    };
  
    const handlePay = async (loan_Amount,investor_id,original_duration,invest_status,loan_status) => {
      try {
        let amount = parseInt(loan_Amount.replace('₹', '').replace(/\s+/g, ''));
        let duration = parseInt(original_duration.replace('month', '').replace(/\s+/g, ''));
        const data = {
          amount
        }
         const order = await dispatch(createOrder(data))
          handlePaymentVerify(order.data,investor_id,duration,invest_status,loan_status)
      } catch (error) {
          console.log(error);
      }
  }
  
  const handlePaymentVerify = async (data,investor_id,duration,invest_status,loan_status) => {
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
              const data={
                razorpay_order_id: response.razorpay_order_id,
                         razorpay_payment_id: response.razorpay_payment_id,
                         razorpay_signature: response.razorpay_signature,
              }
              const payment = await dispatch(payingMoney(data))
              
              const verifyData = await payment;
              console.log(verifyData);
              if(verifyData.message==="Payment Successful"){
                const data={
                  investorId:investor_id,
                  invest_status,
                  loan_status,
                  duration
                }
               const pay_status= await dispatch(moneyPaid(data))
               console.log(pay_status);
              } 
              await fetchLoanRequests();
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
  
    const handleNegotiate = (investor_email, investoruser_id, loan_amount, loan_duration, loan_rate_of_interest, loan_user_id, loan_id) => {
      setInvestor_email(investor_email);
      setInvestoruser_id(investoruser_id);
      setLoan_amount(loan_amount);
      setLoan_duration(loan_duration);
      setLoanInterestRate(loan_rate_of_interest);
      setLoanUserId(loan_user_id);
      setLoanId(loan_id);
      setIsOverlayOpen(true)
    }
    const handleSubmit = async(amount, duration, interestRate) => {
      const data = {
        investor_email: investor_email,
        investoruser_id: investoruser_id,
        loan_amount: loan_amount,
        loan_duration: loan_duration,
        loanInterestRate: loanInterestRate,
        loanUserId: loanUserId,
        loanId: loanId,
        negotiateAmount: amount,
        negotiateDuration: duration,
        negotiateInterestRate: interestRate
      };
  
      dispatch(investorNegotiate(data));
      await fetchLoanRequests();
    };
  return (
    <>
    <div className=' h-full w-full text-neutral-100 gradient-bg-transactions'>
    <div className='min-h-screen  h-full w-full  px-5 sm:px-7 md:px-10 lg:px-14 xl:px-16 4xl:px-20'>
      <div className='flex justify-center items-center h-fit mb-10 p-2 tracking-normal font-serif  text-xl md:text-3xl  font-bold'>Detail</div>
      <div className="grid grid-cols-1 gap-4 gradient-bg-services  ">
                 {showLoanRequest?.map((user, index) => ( 
                  <div key={'index'} className="border  p-4 rounded-lg flex max-md:flex-wrap gap-5 justify-between items-center">
                    <div className="relative border p-4 w-62 rounded-lg flex  flex-wrap h-fit justify-between items-center ">
                      <div className='block w-full h-fit text-center text-xl text-gray-500 font-bold'>Loan Requirement</div>
                      <div className="relative w-fit h-fit flex flex-wrap flex-col  ">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Amount:</strong> {user?.loan_amount}</p>
                      </div>
                      <div className=" relative w-fit h-fit flex flex-wrap flex-col gap-4">
                        <p><strong>Duration:</strong> {user?.duration}</p>
                        <p><strong>Interest Rate:</strong> {user?.rate_of_interest}</p>
                      </div>
                      <div className='relative  flex pr-2 flex-wrap  w-fit h-full justify-end items-end'>
                                 
                                    {user.document_file ? (
                        <a href={'user.document_file'} target="_blank" rel="noopener noreferrer">
                          <GrDocumentPdf size={30} className='mt-2'/>
                        </a>
                      ) : (
                        <span className='font-semibold'>NULL</span>
                      )}
                                  </div>
                    </div>
                    <div className="relative border  p-4 rounded-lg w-fit h-fit flex flex-wrap justify-between items-center gap-5">
                    <div className='block w-full h-fit text-center text-gray-500 text-xl font-bold'>Your Investment</div>
                      
                      <div className="flex flex-wrap w-fit h-fit flex-col gap-4">
                        <p><strong>Amount:</strong> {user?.original_amount}</p>
                        <p><strong>Duration:</strong> {user?.original_duration}</p>
                      </div>
                      <div className="w-fit h-fit flex flex-wrap flex-col gap-4">
                        <p><strong>Interest Rate:</strong> {user?.original_rate_of_interest}</p>
                      </div>
                    </div>
                      
                     <div className="space-2 w-fit h-fit gap-2 flex flex-wrap md:flex-col justify-center ">
                      
                      {user.state === 'Approved' ? (
                         user.pay_status==='Paid' ? (
                           <button className="bg-gray-400 text-white px-4 py-2 rounded-full cursor-not-allowed">Paid</button>
                       ) : 
                        (
                          <>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-full" onClick={()=>handlePay(user.original_amount,user.investor_id,user.original_duration,"paid","Paid")}>Pay</button>
                            <p className="text-sm text-red-600 text-center">Pay within three days.<br/> Otherwise Your account will block.</p>
                          </>
                        )
                      ) : (
                        <>
                          <button className="bg-green-500 text-white px-4 py-2 rounded-full" onClick={() => handleApprove(index, 'Approved', user.investor_id, user.id,'Not-paid')}>Approve</button>
                          <button className="bg-yellow-500 text-white px-4 py-2 rounded-full" onClick={() => handleNegotiate(user.investor_email, user.investoruser_id, user.loan_amount, user.duration, user.rate_of_interest, user.user_id, user.id)}>Negotiate</button>
                          <button className="bg-red-500 text-white px-4 py-2 rounded-full" onClick={() => handleRejected('Rejected', user.investor_id, user.id)}>Reject</button>
                        </>
                      )}
                    </div> 
                  </div>
                 ))} 
              </div>
              
    </div>
    <NegotiateForm
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        onSubmit={handleSubmit} // Pass the rejection submission handler
      /*userId={currentRejectUserId} // Pass the userId to RejectionOverlay
      usersId={currentRejectUsersId} */
      />
    </div>
    </>
  )
}

export default LoanDetail