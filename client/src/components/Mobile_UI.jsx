import React from 'react'
import { Link } from 'react-router-dom'

function Mobile_UI({id , amount , name,email}) {
  return (
    <>
    <div className='w-full  px-5 sm:px-6 md:px-8 lg:px-10 h-full mb-10 text-neutral-100 '>
      <div className='relative gradient-bg-services  p-2 rounded-lg w-full h-fit flex flex-wrap justify-between items-center gap-1'>
    {/* <div className=' block w-full h-fit text-center text-gray-100 text-xl font-bold'>{type}</div> */}

<div className='relative flex justify-around items-center w-full h-36 rounded-lg  text-md sm:text-xl md:text-2xl'>
    <div className='flex flex-wrap items-start justify-center h-fit w-fit flex-col'>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    </div>
    <div className='flex flex-wrap items-start justify-center h-fit w-fit flex-col'>
    <p><strong>Amount:</strong> {amount}</p>
    </div>
    
</div>
<div className='flex items-center justify-end w-full h-fit'>
<div className='  w-fit h-fit text-center text-gray-500 p-2 text-xl font-bold right-0 gradient-bg-transactions hover:bg-gray-400 rounded-lg '>
       <Link to={`${id}`}> <button>Details</button></Link>
    </div>
</div>
</div>
    </div>
    
    </>
  )
}

export const Repayment_Mobile_UI=({name , id ,  pay_status , amount , leftDays})=>{
  return (
    <>
    <div className='w-full  px-5 sm:px-6 md:px-8 lg:px-10 h-full mb-10 text-neutral-100 '>
      <div className='relative gradient-bg-services  p-2 rounded-lg w-full h-fit flex flex-wrap justify-between items-center '>
    {/* <div className=' block w-full h-fit text-center text-gray-100 text-xl font-bold'>{type}</div> */}

<div className='relative flex justify-around items-center w-full h-36 rounded-lg  text-md sm:text-xl md:text-2xl'>
    <div className='flex flex-wrap flex-col p-2'>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Pay-Status:</strong> {pay_status}</p>
    </div>
    <div className='flex flex-wrap flex-col p-2'>
    <p><strong>Amount:</strong> {amount}</p>
    <p><strong>Remain Days:</strong> {leftDays}</p>
    </div>
    
</div>
<div className='flex items-center justify-end w-full h-fit'>
<div className='  w-fit h-fit text-center text-gray-500 p-2 text-xl font-bold right-0 gradient-bg-transactions hover:bg-gray-400 rounded-lg '>
       <Link to={`${id}`}> <button>Details</button></Link>
    </div>
</div>

</div>
    </div>
    
    </>
  )
}

export default Mobile_UI