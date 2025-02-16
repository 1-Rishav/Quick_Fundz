import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import {  negotiateValue ,negotiationApprove,rejectNegotiation} from '../redux/slices/auth';
import {motion} from 'motion/react';
import Mobile_UI from './Mobile_UI';
import CustomButton from './UI/CustomButton';
import Model from './Modal';
import { useDisclosure } from '@heroui/modal';

const NegotiateLoan = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userid , setuserid] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastAmount,setLastAmount]=useState(null); 
  const [refresh , setRefresh] = useState(false)
  const [countNegotiation , setCountNegotiation] = useState(null);
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);

  const usersPerPage = 4;

  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = lastAmount?.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(lastAmount?.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchNegotiateRequests = async () => {
    //const data = { investorUserId: user_id };
    try {
     const finalAmount=await dispatch(negotiateValue());
      setLastAmount(finalAmount.finalAmount);
      setCountNegotiation(finalAmount.finalAmount.length);
    } catch (error) {
      console.error("Error fetching KYC requests: ", error);
    }
  };


  useEffect(() => {
    
    fetchNegotiateRequests();
  }, [dispatch, user_id,refresh]);
  
  const handleApprove= async(negotiateId,loanId,negotiateAmount,negotiateDuration,negotiateROI,status,pay_status)=>{
    const data={
      negotiateId: negotiateId,
      loanId: loanId,
      negotiateAmount,
      negotiateDuration,
      negotiateROI,
      status: status,
      pay_status
    }
   await dispatch(negotiationApprove(data))
    setRefresh(prev=>!prev)
  }

  const handleReject= async(negotiateId,loanId,status)=>{
    const data={
      negotiateId:negotiateId,
      loanId:loanId,
      status:status,
      
    }
   await dispatch(rejectNegotiation(data));
    setRefresh(prev=>!prev)
  };

  const handleModal = (id)=>{
    setuserid(id);
 }
  return (
    <div className="flex h-full overflow-hidden">
      <div className="z-index-50 ">
        <Sidebar />
      </div>
      <div className="flex max-lg:hidden flex-col flex-1 max-md:flex-wrap  max-w-8xl mx-auto p-4 overflow-scroll overflow-x-hidden gradient-bg-transactions text-neutral-50">
        {countNegotiation>0 ? <h1 className="text-2xl font-bold mb-6 text-center">Loan Negotiation</h1>:<h1 className="text-2xl font-bold mb-6 flex items-center justify-center h-full">No Negotiation Request Yet</h1>}
        <div className="grid grid-cols-1 gap-4">
          {currentUsers?.map((user, index) => (
            <div key={index} className="border p-4 gradient-bg-services rounded-lg flex max-md:flex-wrap gap-4 justify-between items-center">
              <motion.div className="[perspective::1000px] [transform-style:preserve-3d] relative border p-4 rounded-lg flex flex-wrap h-fit justify-between items-center gap-2"
              whileHover={{
                rotateX:10,
                rotateY:10,
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
            onClickCapture={()=>handleModal(user.user_id)}
              >
                <span className="block w-full h-fit text-center text-xl text-gray-500 font-bold">Negotiation-Requirements</span>
                <div className="relative w-fit h-fit flex flex-wrap flex-col ">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Amount:</strong> {user?.negotiate_amount}</p>
                </div>
                <div className="relative w-fit h-fit flex flex-wrap flex-col gap-4">
                  <p><strong>Duration:</strong> {user?.negotiate_duration}</p>
                  <p><strong>Interest Rate:</strong> {user?.negotiate_rate_of_interest}</p>
                </div>
              </motion.div>
              <motion.div className="[perspective::1000px] [transform-style:preserve-3d] relative border p-4 rounded-lg h-fit w-fit flex flex-wrap justify-between items-center gap-5"
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
            onClickCapture={()=>handleModal(user.loan_user_id)}
              >
                <span className="block w-full h-fit text-center text-gray-500 text-xl font-bold">Your Requirements</span>
                <div className="flex flex-wrap w-fit h-fit flex-col gap-4">
                  <p><strong>Amount:</strong> {user?.loan_amount}</p>
                  <p><strong>Duration:</strong> {user?.loan_duration}</p>
                </div>
                <div className="w-fit h-fit flex flex-wrap flex-col gap-4">
                  <p><strong>Interest Rate:</strong> {user?.loan_rate_of_interest}</p>
                </div>
              </motion.div>

              <div className="space-2 w-fit h-fit gap-2 flex flex-wrap md:flex-col justify-center">
                {user.negotiate_status==='Approved'?<div className=" px-4 py-2 "><CustomButton button='Approved' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)'/></div>:<div className=" px-4 py-2 " onClick={()=>handleApprove(user.id,user.loan_id,user.negotiate_amount,user.negotiate_duration,user.negotiate_rate_of_interest,'Approved','Not-paid')}><CustomButton button='Approve' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)'/></div>

}
                    {user.negotiate_status !=='Approved' && <div className=" px-4 py-2 " onClick={()=>handleReject(user.id,user.loan_id,'Rejected')}><CustomButton button='Reject' textColor='text-red-400' bottomColor='via-red-500' rgbColor='rgba(235, 48, 20,0.7)'/></div>}
                  
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
       {countNegotiation>4 && <div className="flex justify-end mt-6 space-x-2 ">
          <button
            className={`px-4 py-2 rounded-lg  ${currentPage === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'}`}
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
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'}`}
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
  {countNegotiation>0 ? <h1 className="text-2xl font-bold mb-6 text-neutral-100 text-center">Negotiation</h1>:<h1 className="text-2xl font-bold mb-6 flex items-center text-neutral-100 justify-center h-screen">No Negotiation Request Yet</h1>}
    {currentUsers?.map((user, index) => (
      <div key={index}>
        <Mobile_UI
          name={user.name}
          id={user.id}
          amount={user.loan_amount}
          email={user.email}
        />
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default NegotiateLoan;