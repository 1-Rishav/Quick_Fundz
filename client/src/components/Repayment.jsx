import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, moneyRepayment, payingMoney, repayLoan } from '../redux/slices/auth';
import { Repayment_Mobile_UI } from './Mobile_UI';
import { motion} from 'motion/react';
import CustomButton from './UI/CustomButton';
import Model from './Modal';
import { useDisclosure } from '@heroui/modal';

const LoanRepayment = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userid , setuserid] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [repayLoanStatus, setRepayLoanStatus] = useState(null);
  const [countRepayLoan , setCountRepayLoan] = useState(null);
  const [refresh , setRefresh] = useState(false);
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);

  const usersPerPage = 4;

  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = repayLoanStatus?.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(repayLoanStatus?.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchRepayStatus = async () => {
    const data = { investorUserId: user_id };
    try {
      const repayStatus = await dispatch(repayLoan(data));
      setRepayLoanStatus(repayStatus?.repayData);
      setCountRepayLoan(repayStatus?.repayData?.length);
    } catch (error) {
      console.error("Error fetching KYC requests: ", error);
    }
  };

  useEffect(() => {
   
    fetchRepayStatus();
  }, [dispatch, user_id,refresh]);

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
                 setRefresh(prev=>!prev)
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

    const handleModal = (id)=>{
      setuserid(id);
   }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="z-index-50 ">
        <Sidebar />
      </div>
      <div className="flex max-lg:hidden sm:flex-col max-md:flex-wrap h-full min-h-screen  flex-1 max-w-8xl mx-auto sm:p-4 overflow-scroll overflow-x-hidden gradient-bg-transactions ">
       {countRepayLoan>0 ? <h1 className="text-2xl h-fit w-full font-bold mb-6 text-center text-neutral-50">Re-Payment</h1>:<h1 className=" text-2xl font-bold mb-6 flex justify-center items-center text-center w-full h-[90vh] text-neutral-50">No Re-Payment Data</h1>}
        <div className="grid grid-cols-1 gap-4">
          {currentUsers?.map((user, index) => (
            <div key={index} className="border p-4 gradient-bg-services rounded-lg flex max-md:flex-wrap gap-5 justify-between items-center">
              <motion.div className=" [perspective::1000px] [transform-style:preserve-3d] relative border p-4 rounded-lg flex flex-wrap h-fit justify-between items-center gap-2"
              whileHover={{
                rotateX:10,
                rotateY:-10,
                //rgba(8,112,184,0.7)
                boxShadow:`0px 10px 30px rgba(150, 200, 189, 0.888)`,
                y: -6,
            }}
            whileTap={{
                y:0
            }}
            style={{
                translateZ:100,
            }}
            onClick={onOpen}
            onClickCapture={()=>handleModal(user.provider_user_id)}
              >
                <div className="block w-full h-fit text-center text-xl text-gray-500 font-bold ">Money-Lender Credentials</div>
                <div className="relative w-fit h-fit flex flex-wrap flex-col text-neutral-50">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Loan_Amount:</strong> {user?.loan_amount}</p>
                </div>
                <div className="relative w-fit h-fit flex flex-wrap flex-col gap-4 text-neutral-50">
                  <p><strong>Duration:</strong> {user?.loan_duration}</p>
                  <p><strong>Interest Rate:</strong> {user?.loan_roi}</p>
                </div>
              </motion.div>
              <motion.div className="[perspective::1000px] [transform-style:preserve-3d] relative border p-4 rounded-lg w-fit h-fit flex flex-wrap justify-between items-center gap-2"
              whileHover={{
                rotateX:10,
                rotateY:-10,
                //rgba(8,112,184,0.7)
                boxShadow:`0px 10px 30px rgba(150, 200, 189, 0.888)`,
                y: -6,
            }}
            whileTap={{
                y:0
            }}
            style={{
                translateZ:100,
            }}
            onClick={onOpen}
            onClickCapture={()=>handleModal(user.repayment_user_id)}
              >
                <div className="block w-full h-fit text-center text-gray-500 text-xl font-bold ">Re-payment</div>
                <div className=" flex flex-wrap w-fit h-fit flex-col gap-4 text-neutral-50">
                  <p><strong>Amount:</strong> {`₹ ${user?.interest_amount}`}</p>
                  <p><strong>Remain Days:</strong> {`${user?.remain_days} days`}</p>
                </div>
                <div className="w-fit h-fit flex flex-wrap flex-col gap-4 text-neutral-50">
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
                        <div className="px-4 py-2 rounded-lg"  onClick={()=>handlePay( user.interest_amount,user.id,"Paid")} ><CustomButton button='Pay' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)'/></div>
                        {/* <p className="text-sm text-red-600 text-center">Pay within three days.<br/> Otherwise Your account will block.</p> */}
                      </>
                    )

                ) : <button className="bg-gray-800 text-white px-4 py-2 rounded-lg cursor-not-allowed" >Pay</button>}

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
       {countRepayLoan>4 && <div className="flex justify-end mt-6 space-x-2 ">
          <button
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'}`}
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
            className={`px-4 py-2 rounded-lg  ${currentPage === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'}`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>}
        <Model isOpen={isOpen} onOpenChange={onOpenChange} userId={userid}/>

      </div>
      <div className="max-lg:block hidden h-full w-full">
  <div className="gradient-bg-transactions min-h-screen h-full w-full">
    
    {countRepayLoan>0 ? <h1 className="text-xl sm:text-2xl md:text-3xl text-neutral-100 lg:text-4xl h-fit w-full font-bold mb-6 text-center">Re-Payment</h1>:<h1 className=" text-xl sm:text-2xl md:text-3xl text-neutral-100 lg:text-4xl font-bold mb-6 flex justify-center items-center text-center w-full h-[90vh]">No Re-Payment Data</h1>}
    {currentUsers?.map((user, index) => (
      <div key={index}>
        <Repayment_Mobile_UI
        
          name={user.name}
          id={user.id}
          amount={user.interest_amount}
          pay_status={user.payment_status}
          leftDays={user.remain_days}
        />
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default LoanRepayment;