import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { negotiationApprove, rejectNegotiation , screenNegotiate} from '../redux/slices/auth';
import { useParams } from 'react-router-dom';
import {motion} from 'motion/react'
import CustomButton from './UI/CustomButton';
import Model from './Modal';
import { useDisclosure } from '@heroui/modal';

function NegotiateDetail() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userid , setuserid] = useState(null);
    const [showNegotiateRequest , setShowNegotiateRequest] = useState(null);
    const [refresh , setRefresh] = useState(false);

    const dispatch = useDispatch();
    const params = useParams();
    const {id} = params;
    const {user_id} = useSelector((state) => state.auth)

    const fetchNegotiateRequests = async () => {
            
      const data={id,user_id}
      try {
        const negotiateRequest = await dispatch(screenNegotiate(data));
        setShowNegotiateRequest(negotiateRequest.finalAmount);
        
      } catch (error) {
        console.error("Error fetching KYC requests: ", error);
      }
    };

useEffect(() => {
    
          fetchNegotiateRequests();
      
        }, [dispatch, user_id,id,refresh]);
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
        setRefresh(prev=>!prev)      }
    
      const handleReject=async(negotiateId,loanId,status)=>{
        const data={
          negotiateId:negotiateId,
          loanId:loanId,
          status:status,
          
        }
       await dispatch(rejectNegotiation(data))
        setRefresh(prev=>!prev)
      };

      const handleModal = (id)=>{
        setuserid(id);
     }
  return (
    <>
    <div className=' h-full w-full text-neutral-100 gradient-bg-transactions'>
    <div className='min-h-screen  h-full w-full  px-5 sm:px-7 md:px-10 lg:px-14 xl:px-16 4xl:px-20'>
      <div className='flex justify-center items-center h-fit mb-10 p-2 tracking-normal font-serif  text-xl md:text-3xl  font-bold'>Detail</div>
      <div className="grid grid-cols-1 gap-4 gradient-bg-services  ">
                 {showNegotiateRequest?.map((user, index) => ( 
                  <div key={index} className="border  p-4 rounded-lg flex max-md:flex-wrap gap-5 justify-between items-center">
                    <motion.div className=" [perspective::1000px] [transform-style:preserve-3d] relative border p-4 w-62 rounded-lg flex  flex-wrap h-fit justify-between items-center "
                    
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
                      <div className='block w-full h-fit text-center text-xl text-gray-500 font-bold'>Negotiation-Requirements</div>
                      <div className="relative w-fit h-fit flex flex-wrap flex-col  ">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Amount:</strong> {user?.negotiate_amount}</p>
                      </div>
                      <div className=" relative w-fit h-fit flex flex-wrap flex-col gap-4">
                        <p><strong>Duration:</strong> {user?.negotiate_duration}</p>
                        <p><strong>Interest Rate:</strong> {user?.negotiate_rate_of_interest}</p>
                      </div>
                    </motion.div>
                    <motion.div className="[perspective::1000px] [transform-style:preserve-3d] relative border  p-4 rounded-lg w-fit h-fit flex flex-wrap justify-between items-center gap-5"
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
                    <div className='block w-full h-fit text-center text-gray-500 text-xl font-bold'>Your Requirements</div>
                      
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
              
    </div>
    <Model isOpen={isOpen} onOpenChange={onOpenChange} userId={userid}/>

    </div>
    </>
  )
}

export default NegotiateDetail