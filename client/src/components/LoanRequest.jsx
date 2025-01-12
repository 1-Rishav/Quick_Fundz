import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { approvedLoan, investorNegotiate, rejectedLoan, requestInvestor,moneyPaid,createOrder, payingMoney } from '../redux/slices/auth';
import NegotiateForm from './NegotiateForm'
import { GrDocumentPdf } from 'react-icons/gr';

const LoanRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoanRequest, setShowLoanRequest] = useState(null);

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [investor_email, setInvestor_email] = useState(null);
  const [investoruser_id, setInvestoruser_id] = useState(null);
  const [loan_amount, setLoan_amount] = useState(null);
  const [loan_duration, setLoan_duration] = useState(null);
  const [loanInterestRate, setLoanInterestRate] = useState(null);
  const [loanUserId, setLoanUserId] = useState(null);
  const [loanId, setLoanId] = useState(null);
  const [countRequest , setCountRequest] = useState(null);
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);

  const usersPerPage = 8;

  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = showLoanRequest?.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(showLoanRequest?.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchKycRequests = async () => {
      const data = { investorUserId: user_id };
      try {
        const loanRequestUser = await dispatch(requestInvestor(data));
        setShowLoanRequest(loanRequestUser.loanTaker);
        setCountRequest(loanRequestUser.loanTaker.length)
      } catch (error) {
        console.error("Error fetching KYC requests: ", error);
      }
    };

    fetchKycRequests();

  }, [dispatch, user_id]);

  const handleApprove = (index, status, userId, loanId,pay_status) => {
    const data = {
      status: status,
      userId: userId,
      loanId: loanId,
      pay_status
    }
    dispatch(approvedLoan(data))
  };

  const handleRejected = (status, userId, loanId) => {
    const data = {
      status: status,
      userId: userId,
      loanId: loanId,
    };
    dispatch(rejectedLoan(data));
    window.location.reload();
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
  const handleSubmit = (amount, duration, interestRate) => {
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
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="z-index-50 ">
        <Sidebar />
      </div>
      <div className="flex  flex-wrap sm:flex-col flex-1 max-w-8xl  mx-auto sm:p-4 overflow-scroll overflow-x-hidden gradient-bg-transactions text-neutral-50">
       {countRequest>0 ? <h1 className="text-2xl font-bold mb-6 text-center ">Loan Requests</h1>:<h1 className="text-2xl w-full font-bold mb-6 flex-wrap flex-col flex text-center items-center justify-center h-full ">No Loan Request Yet</h1>} 
        <div className="grid grid-cols-1 gap-4">
          {currentUsers?.map((user, index) => (
            <div key={index} className="border p-4 rounded-lg flex flex-wrap gap-5 justify-between items-center">
              <div className="relative border p-4 w-fit   rounded-lg flex  flex-wrap h-fit justify-between items-center ">
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
                  <a href={user.document_file} target="_blank" rel="noopener noreferrer">
                    <GrDocumentPdf size={30} />
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
                {/* approvedRequests[index] */}
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

        {/* Pagination */}
       {countRequest>7 &&  <div className="flex justify-end mt-6 space-x-2 ">
          <button
            className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === 1 ? 'bg-gray-300' : 'bg-slate-800 text-white'}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === index + 1 ? 'bg-amber-500 text-white' : 'bg-gray-300'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === totalPages ? 'bg-gray-300' : 'bg-green-600 text-white'}`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>}
      </div>
      <NegotiateForm
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        onSubmit={handleSubmit} // Pass the rejection submission handler
      /*userId={currentRejectUserId} // Pass the userId to RejectionOverlay
      usersId={currentRejectUsersId} */
      />
    </div>
  );
};

export default LoanRequest;