import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, moneyRepayment, payingMoney, repayLoan } from '../redux/slices/auth';

const LoanRepayment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [repayLoanStatus, setRepayLoanStatus] = useState(null);
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);

  const usersPerPage = 8;

  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = repayLoanStatus?.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(repayLoanStatus?.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchRepayStatus = async () => {
      const data = { investorUserId: user_id };
      try {
        const repayStatus = await dispatch(repayLoan(data));
        setRepayLoanStatus(repayStatus);
      } catch (error) {
        console.error("Error fetching KYC requests: ", error);
      }
    };

    fetchRepayStatus();
  }, [dispatch, user_id]);

     const handlePay = async ( repay_amount,pay_id,paid_status ) => {
         try {
          
          let amount = parseInt(repay_amount.replace('₹', '').replace(/\s+/g, ''));
          const data = {
            amount
          }
           const order = await dispatch(createOrder(data))
            handlePaymentVerify(order.data,pay_id,paid_status)
         } catch (error) {
             console.log(error);
         }
     }

    const handlePaymentVerify = async (data,pay_id,paid_status) => {
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
                    pay_id,
                    paid_status
                  }
                 const pay_status= await dispatch(moneyRepayment(data))
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="z-index-50 ">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 max-w-8xl mx-auto p-4 overflow-scroll overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6 text-center">Re-Payment</h1>
        <div className="grid grid-cols-1 gap-4">
          {currentUsers?.map((user, index) => (
            <div key={index} className="border p-4 rounded-lg flex justify-between items-center">
              <div className="relative border p-4 rounded-lg flex h-32 justify-between items-center gap-5">
                <span className="absolute top-0 text-xl text-gray-600 font-bold ">Money-Lender Credentials</span>
                <div className="flex flex-col ">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Loan_Amount:</strong> {user?.loan_amount}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <p><strong>Duration:</strong> {user?.loan_duration}</p>
                  <p><strong>Interest Rate:</strong> {user?.loan_roi}</p>
                </div>
              </div>
              <div className="relative border p-4 rounded-lg h-32 flex justify-between items-center gap-5">
                <span className="absolute top-0 text-xl text-gray-600 font-bold ">Re-payment</span>
                <div className="flex flex-col gap-4">
                  <p><strong>Amount:</strong> {`₹ ${user?.interest_amount}`}</p>
                  <p><strong>Remain Days:</strong> {`${user?.remain_days} days`}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <p><strong>Pay_Status:</strong> {user?.payment_status}</p>
                </div>
              </div>

              <div className="space-2 gap-2 flex flex-col ">
                {user.enable_pay === true ? (

                  user.payment_status === 'Paid' ? (
                    <button className="bg-gray-400 text-white px-4 py-2 rounded-full cursor-not-allowed">Paid</button>
                  ) :
                    (
                      <>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-full"  onClick={()=>handlePay( user.interest_amount,user.id,"Paid")} >Pay</button>
                        {/* <p className="text-sm text-red-600 text-center">Pay within three days.<br/> Otherwise Your account will block.</p> */}
                      </>
                    )

                ) : <button className="bg-gray-500 text-white px-4 py-2 rounded-full cursor-not-allowed" >Pay</button>}

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6 space-x-2 ">
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
        </div>
      </div>
    </div>
  );
};

export default LoanRepayment;