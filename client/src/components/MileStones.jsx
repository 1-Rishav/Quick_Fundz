import React,{useEffect,useState} from 'react'
import { useDispatch } from 'react-redux'
import { activeUser, allNegotiateData, investedUsers, loanRequestUsers } from '../redux/slices/auth';

function MileStones() {
    const [allUser , setAllUser] = useState([]);
  const [allInvestor , setAllInvestor] = useState(null);
  const [allborrower , setAllBorrower] = useState(null);
  const [allNegotiation , setAllNegotiation] = useState(null);
const dispatch = useDispatch();
  useEffect(()=>{
    const getSummary = async()=>{
      const user = await dispatch(activeUser());
      setAllUser(user.length);
     
      const investor = await dispatch(investedUsers());
      
      const borrower = await dispatch(loanRequestUsers());
      
      const loanApproval = borrower.reduce((count , item)=> {return item.state==='Approved'?count+1:count},0)
      //const percentageApproval = (loanApproval/borrower.length)*100;
      setAllBorrower(loanApproval)
      const investorNegotiation = await dispatch(allNegotiateData());
      const successNegotiation = investorNegotiation.reduce((count,item)=>{return item.negotiate_status==="Approved"?count+1:count},0)
      setAllNegotiation(successNegotiation)


      const totalInvestment = investor.reduce((sum, item) => {
        const numericAmount = Number(item.amount.replace(/₹\s*/, "")); // Remove ₹ and convert to number
        return sum + numericAmount;
        
    }, 0);
    setAllInvestor(totalInvestment)
      
    }
    getSummary();
  },[])


 
  return (
    <div className=' p-5 flex  flex-wrap items-center justify-evenly h-fit w-[96vw] relative text-neutral-100 left-3 right-3 top-5 white-glassmorphism'>
        
        <div className=' absolute flex flex-col  underline h-full w-fit text-5xl font-bold '>
            <h1>Live Feed</h1>
            
        </div>
        <div className=' absolute top-16  flex flex-col h-[1px] w-full'>
        <hr className=' w-full '/>
            
        </div>
        <div className=' flex flex-col items-center justify-end text-2xl font-semibold h-32 w-fit'>
            <h1 className='text-center'>{`₹ ${allInvestor}`}</h1>
            <h2>Lent So Far</h2>
        </div>
        <div className=' flex flex-col items-center justify-end h-32 w-fit text-2xl font-semibold'>
            <h1 className='text-center'>{allborrower}</h1>
            <h2>Loan Approved</h2>
        </div>
        <div className=' flex flex-col items-center justify-end h-32 w-fit text-2xl font-semibold'>
           <h1 className='text-center'>{allUser}</h1> 
            <h2>Registered User</h2>
        </div>
        <div className=' flex flex-col items-center justify-end h-32 w-fit text-2xl font-semibold'>
            <h1 className='text-center'>{allNegotiation}</h1>
            <h2>Success Negotiation</h2>
        </div>
        

    </div>
  )
}

export default MileStones