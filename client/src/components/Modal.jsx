import React, { useEffect, useState } from 'react'
import {Chip} from "@heroui/chip";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,

  } from "@heroui/react";
  import { IoCopyOutline } from "react-icons/io5";
  import { LuCopyCheck } from "react-icons/lu";
import { userDetail } from '../redux/slices/auth';
import { useDispatch } from 'react-redux';

const Model = ({ isOpen, onOpenChange,userId}) => {
  const [copied, setCopied] = useState(false);
  const [userEmail , setUserEmail] = useState(null);
  const [userDetails , setUserDetails] = useState(null);
  const [userInvest , setUserInvest] = useState(null);
  const [userLoan , setUserLoan] = useState(null);
  const [userPaid , setUserPaid] =useState(null);
  const [userNotPaid , setUserNotPaid] = useState(null);
  
  const dispatch = useDispatch();
useEffect(()=>{
  const fetchUserDetails = async()=>{
    try {
      
      const data = {
        userId
      }
      const detail = await dispatch(userDetail(data));
      setUserDetails(detail)
      setUserEmail(detail.userEmail);
      setUserInvest(detail.userInvestment.length);
      setUserLoan(detail.userLoan.length);
      setUserPaid(detail.userPaid.length);
      setUserNotPaid(detail.userNotPaid.length);
      
    } catch (error) {
      console.log(error);
    }
  }
fetchUserDetails()
},[userId,dispatch])



  const copyToClipboard = () => {
    navigator.clipboard.writeText(userEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };
  
  return (
          <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' placement='center' scrollBehavior='inside' >
              <ModalContent >
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 gradient-bg-transactions rounded-t-xl  text-white">User Summary</ModalHeader>
                    <ModalBody className='gradient-bg-transactions rounded-b-xl text-white'>
                      <div className=' w-full h-48 flex items-center justify-center'>
                        <div className='w-44 h-44  rounded-lg '>
                        <img src={userDetails.userAvatar} alt={userDetails.userAvatar==null?'No Image Available':''} className='w-full h-44 text-center' />
                      </div>
                      </div>
                      <h1 className='w-full h-full text-white text-center text-xl'><Chip color='warning' variant='shadow' >User Detail</Chip></h1>
                  <div className=' w-full h-full '>
                    <div className='p-2 w-full h-full flex max-sm:flex-wrap items-start justify-between'>
                    <div className='p-2 w-fit h-full flex flex-col max-sm:flex-wrap items-start justify-between'>
                      <div>Name:- {userDetails.userName}</div>
                       {userEmail?.length>14 ? <div>Email:- {userEmail.substring(0 , 12)}... {copied ? <LuCopyCheck className='inline-flex'size={20}/>:<IoCopyOutline size={20} className='inline-flex hover:bg-neutral-100 hover:text-black rounded-full ' onClick={copyToClipboard}/>}</div> : <div>Email:- {userEmail}</div>
                      } 
                      
                    </div>
                    <div className='p-2 w-fit h-full flex flex-col max-sm:flex-wrap items-start justify-between'>
                      {userDetails?.verified==='verified'?<div>Verified:- <Chip color='success' variant='shadow'>Yes</Chip> </div>:<div>Verified:- <Chip color='danger' variant='shadow'>No</Chip> </div>}
                      <div>ACC. Age:- {userDetails.totalMonths} month </div>
                    </div>
                  </div>
                  </div>
                      <h1 className='w-full h-full text-center text-xl'><Chip color='warning' variant='shadow' >Payment History</Chip></h1>
                      <div className=' w-full h-full '>
                    <div className='p-2 w-full h-full flex max-sm:flex-wrap items-start justify-between'>
                    <div className='p-2 w-fit h-full flex flex-col max-sm:flex-wrap items-start justify-between'>
                      <div>Total Loan:- {userLoan}</div>
                      <div>Any Due:- {userNotPaid}</div>
                      
                    </div>
                    <div className='p-2 w-fit h-full flex flex-col max-sm:flex-wrap items-start justify-between'>
                      <div>Successfull Repay:- {userPaid}</div>
                      <div>Investment:- {userInvest}</div>
                    </div>
                  </div>
                  </div>
                    </ModalBody>
                   
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        );
      }

export default Model