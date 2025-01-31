import React from 'react'

function MileStones({platformMile}) {
 
  return (
    <div className=' p-5 md:ml-1 lg:ml-2 xl:ml-3 flex  max-lg:flex-wrap items-center gap-5 justify-evenly h-fit w-[96vw] relative text-neutral-100 left-3 right-3 top-5 white-glassmorphism'>
        
        <div className=' absolute flex flex-col  underline h-full w-fit text-5xl font-bold '>
            <h1>Live Feed</h1>
            
        </div>
        <div className=' absolute top-16  flex flex-col h-[1px] w-full'>
        <hr className=' w-full '/>
            
        </div>
        <div className=' flex flex-col items-center justify-end text-2xl font-semibold h-32 w-fit'>
            <h1 className='text-center'>{`₹ ${platformMile?.totalInvestment}`}</h1>
            <h2>Lent So Far</h2>
        </div>
        <div className=' flex flex-col items-center justify-end h-32 w-fit text-2xl font-semibold'>
            <h1 className='text-center'>{platformMile?.loanApproval}</h1>
            <h2>Loan Approved</h2>
        </div>
        <div className=' flex flex-col items-center justify-end h-32 w-fit text-2xl font-semibold'>
           <h1 className='text-center'>{platformMile?.userLength}</h1> 
            <h2>Registered User</h2>
        </div>
        <div className=' flex flex-col items-center justify-end h-32 w-fit text-2xl font-semibold'>
            <h1 className='text-center'>{platformMile?.successNegotiation}</h1>
            <h2>Success Negotiation</h2>
        </div>
        

    </div>
  )
}

export default MileStones