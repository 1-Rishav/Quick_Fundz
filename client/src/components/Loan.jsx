import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaSearch } from "react-icons/fa";
import LoanAcceptForm from "./LoanAcceptForm";
import { allInvestments, loanRequest,loanAccept } from "../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import LoanPre_Request from "./LoanPre_Request";
import CustomButton from "./UI/CustomButton"
import {motion} from 'motion/react';
import { useDisclosure } from "@heroui/modal";
import Model from "./Modal";

const Loan = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userid , setuserid] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 5;
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [showInvestor, setShowInvestor] = useState(null);
  const [loanAcceptUserId, setLoanAcceptUserId] = useState(null);
  const [loanAcceptUsers_Id, setLoanAcceptUsers_Id] = useState(null);
  const [investorAmount, setInvestorAmount] = useState(null);
  const [investorDuration, setInvestorDuration] = useState(null);
  const [investorRate, setInvestorRate] = useState(null);
  const [investorUserId, setInvestorUserId] = useState(null);
  const [investorEmail, setInvestorEmail] = useState(null);
  const [loanStatus, setLoanStatus] = useState(null);
  const [countLoan , setCountLoan] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [refresh , setRefresh] = useState(false)
  const [error, setError] = useState("");
  const { user_id } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(false);


  const fetchLoans = async () => {
    try {
      const InvestorDetail = await dispatch(allInvestments());
      const result = await InvestorDetail;
      setShowInvestor(InvestorDetail?.liveLoan)
      setCountLoan(InvestorDetail?.liveLoan?.length);
      if (result?.status === "success" && Array.isArray(result?.liveLoan)) {
        setLoans(result?.liveLoan);
        setFilteredLoans(result?.liveLoan);
      } else {
        console.error("Unexpected data format:", result);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {

    fetchLoans();
  }, [dispatch,refresh]);
  
  const applyFilter = () => {
    const filtered = loans.filter((loan) => {
      // Parse and format amount input and loan amount for comparison
      const amountValue = amount ? parseFloat(amount.replace(/₹\s*/, '')) : null;
      const loanAmount = loan.amount ? parseFloat(loan.amount.replace(/₹\s*/, '')) : null;

      // Parse interest rate input and loan interest rate for comparison
      const interestRateValue = interestRate ? parseFloat(interestRate.replace('%', '')) : null;
      const loanInterestRate = loan.interest_rate ? parseFloat(loan.interest_rate.replace('%', '')) : null;

      // Convert loan duration to months if it's defined
      const durationPattern = /^(\d+)\s*(month|months|day|days|year|years)?$/i;
      let loanDuration = loan.duration;

      if (loanDuration && durationPattern.test(loanDuration)) {
        const [, durationNum, unit] = loanDuration.match(durationPattern);
        loanDuration = parseInt(durationNum, 10);

        // Convert units to months if not already in months
        if (/year/i.test(unit)) {
          loanDuration *= 12;
        } else if (/day/i.test(unit)) {
          loanDuration = Math.round(loanDuration / 30); // Roughly convert days to months
        }
      }

      // Parse input duration assuming it’s in months for comparison
      const durationValue = duration ? parseInt(duration, 10) : null;

      // Apply filtering conditions
      const amountMatch = amountValue !== null ? loanAmount <= amountValue : true;
      const durationMatch = durationValue !== null ? loanDuration >= durationValue : true;
      const interestRateMatch = interestRateValue !== null ? loanInterestRate <= interestRateValue : true;

      return amountMatch && durationMatch && interestRateMatch;
    });

    // Set filtered results and reset current page to 1 for new results
    setFilteredLoans(filtered);
    setCurrentPage(1);
  };


  const resetFilter = () => {
    setAmount("");
    setDuration("");
    setInterestRate("");
    setFilteredLoans(loans);
    setShowFilter(false);
  };

  const lastIndex = currentPage * loansPerPage;
  const firstIndex = lastIndex - loansPerPage;
  const currentLoans = filteredLoans.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // const handleUserRemoval = (userId) => {
  //   const updatedRequestList = showInvestor.filter(user => user.id !== userId);
  //   setShowInvestor(updatedRequestList);
  // }

  const handleAcceptClick = async(investorId, investorUserId, investorAmount, investorDuration, investorRate, investorEmail, status)=>{
    
    const data = {
      investorId,
      investorUserId,
      investorAmount,
      investorDuration,
      investorRate,
      investorEmail,
      user_id,
      status
    }
   await dispatch(loanAccept(data))
    setRefresh(prev=>!prev);
  //  await fetchLoans()
  }

  const handleClick = (investorId, investorUserId, investorAmount, investorDuration, investorRate, investorEmail, status) => {
    setInvestorEmail(investorEmail);
    setLoanAcceptUserId(investorId);
    setInvestorUserId(investorUserId)
    setInvestorDuration(investorDuration)
    setInvestorRate(investorRate)
    setInvestorAmount(investorAmount);
    setLoanAcceptUsers_Id(user_id)
    setLoanStatus(status);
    setIsOverlayOpen(true);
  }

  const handleSubmit = async(amount, duration, interestRate) => {
    
    const data = {
      investorUserId: investorUserId,
      investorEmail: investorEmail,
      investorAmount: investorAmount,
      investorDuration: investorDuration,
      investorRate: investorRate,
      userId: loanAcceptUserId, // Use the stored userId
      loanUserId: loanAcceptUsers_Id, // Use the stored usersId
      status: loanStatus,
      loanAmount: amount,
      loanDuration: duration,
      loanInterestRate: interestRate
    };

   await dispatch(loanRequest(data));
   setRefresh(prev=>!prev)
    //handleUserRemoval(loanAcceptUserId); // Remove user from the list after rejection
  };
  const handleChangeAmount = (e) => {
    const value = e.target.value.replace(/[^\d]/g, " "); // Strip non-numeric characters
    setAmount(value);

    const amountPattern = /^\d+$/; // Only allow numbers

    // Check if input matches the amount pattern
    if (value === "" || amountPattern.test(value)) {
      setError(""); // Clear error if valid
    } else {
      setError("Please enter a valid amount (e.g., '40000').");
    }
  };

  // Function to handle blur event (add ₹ symbol)
  const handleBlurAmount = () => {
    if (amount) {
      setAmount(`₹ ${amount}`); // Add ₹ symbol on blur if there's a value
    }
  };

  // Function to handle focus event (remove ₹ symbol)
  const handleFocusAmount = () => {
    setAmount(amount.replace("₹ ", "")); // Remove ₹ symbol on focus for editing
  };

  const handleChangeDuration = (e) => {
    const value = e.target.value;
    const durationPattern = /^(\d+)\s*(month|months|day|days|year|years)?$/i;

    if (value === "" || durationPattern.test(value)) {
      setDuration(value.replace(/\D/g, "")); // Only keep numbers in state
      setError(""); // Clear error if valid
    } else {
      setError("Please enter a valid duration (e.g., '2 months', '1 year').");
    }
  };
  const handleBlurDuration = () => {
    if (duration) {
      setDuration(`${duration} month`); // Append '%' on blur if there’s a valid value
    }
  };

  const handleFocusDuration = () => {
    setDuration(duration.replace('month', '')); // Remove '%' on focus for editing
  };

  const handleChangeInterest = (e) => {
    const value = e.target.value.replace('%', ''); // Remove '%' for easier typing
    const ratePattern = /^(100(\.0{1,2})?|[1-9]?[0-9](\.[0-9]{1,2})?)$/; // Validate 0-100 with optional decimals

    // Check if the input matches the rate pattern
    if (value === "" || ratePattern.test(value)) {
      setInterestRate(value); // Update state without '%'
      setError(""); // Clear error if input is valid
    } else {
      setError("Enter a valid interest rate (e.g., 2, 5.5, 100)");
    }
  };

  const handleBlur = () => {
    if (interestRate) {
      setInterestRate(`${interestRate} %`); // Append '%' on blur if there’s a valid value
    }
  };

  const handleFocus = () => {
    setInterestRate(interestRate.replace('%', '')); // Remove '%' on focus for editing
  };
  const handleModal = (id) => {
    setuserid(id)
  }

  return (
    <>
     {countLoan>0 ? (<>
      <div className="flex h-full min-h-screen overflow-hidden">
      <div className="z-index-50 max-sm:absolute">
        <Sidebar />
      </div>
      <div className="flex max-sm:ml-8 flex-col flex-1 max-w-8xl mx-auto p-4 overflow-y-auto relative gradient-bg-transactions ">
         <h1 className="text-2xl font-bold mb-6 text-center">Live Loans</h1>   
          {countLoan>4 &&  <button
          className="p-3 border border-black text-gray-200 rounded-full shadow-md hover:bg-gray-100 flex items-center space-x-2 w-44 absolute top-4 right-4"
          onClick={() => setShowFilter(!showFilter)}
        >
          <FaSearch size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>} 
        {showFilter && (
          <div className="absolute top-20 right-4 bg-white p-4 border shadow-lg rounded-lg w-96 z-50 overflow-y-auto">
            <div className="flex flex-col gap-4 mb-6">
              <input
                type="text"
                placeholder="Minimum Amount"
                value={amount}
                onChange={handleChangeAmount}
                onBlur={handleBlurAmount}
                onFocus={handleFocusAmount}
                className="border p-2 rounded-lg text-black"
              />
              <input
                type="text"
                placeholder="Maximum Duration"
                value={duration}
                onChange={handleChangeDuration}
                onBlur={handleBlurDuration}
                onFocus={handleFocusDuration}
                className="border p-2 rounded-lg text-black"
              />
              <input
                type="text"
                placeholder="Maximum Interest Rate"
                value={interestRate}
                onChange={handleChangeInterest}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className="border p-2 rounded-lg text-black"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <div
                className=" px-4 py-2 rounded-full"
                onClick={applyFilter}
              >
                <CustomButton button='Apply' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)'/>
              </div>
              <div
                className=" px-4 py-2 rounded-full"
                onClick={resetFilter}
              >
               <CustomButton button='Reset' textColor='text-red-400' bottomColor='via-red-500' rgbColor='rgba(235, 48, 20,0.7)'/>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentLoans.map((loan, index) => (
            <motion.div
              key={index}
              className="[perspective::1000px] [transform-style:preserve-3d] border p-4 rounded-lg flex flex-wrap justify-between items-center gradient-bg-services"
              //onClick={()=>console.log('Hii')}
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

            
            >
              <div className="relative w-fit h-fit flex flex-wrap flex-col text-neutral-50" onClick={onOpen}
            onClickCapture={()=>handleModal(loan.user_id)}>
                <p>
                  <strong>Name:</strong> {loan.name}
                </p>
                <p>
                  <strong>Email:</strong> {loan.email}
                </p>
                <p>
                  <strong>Amount:</strong> {loan.amount}
                </p>
              </div>
              <div className="relative w-fit h-fit flex flex-wrap flex-col gap-4 text-neutral-50" onClick={onOpen}
            onClickCapture={()=>handleModal(loan.user_id)}>
                <p>
                  <strong>Duration:</strong> {loan.duration}
                </p>
                <p>
                  <strong>Interest Rate:</strong> {loan.rate_of_interest}
                </p>
              </div>
              <div className="space-2 gap-2 flex justify-center sm:flex-col">
                <div className=" px-4 py-2 rounded-full" onClick={() => {handleAcceptClick(loan.id, loan.user_id, loan.amount, loan.duration, loan.rate_of_interest, loan.email, 'processing') }}>
                  <CustomButton button='Accept' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)'/>
                </div>
                <div className=" px-2 py-2 rounded-full" onClick={() => handleClick(loan.id, loan.user_id, loan.amount, loan.duration, loan.rate_of_interest, loan.email, 'processing')}>
                <CustomButton button='Negotiate' textColor='text-amber-400' bottomColor='via-amber-500' rgbColor='rgba(220, 211, 43,0.7)'/>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
         {countLoan>4 &&  <div className="flex justify-end mt-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === 1 ? "bg-gray-300" : "bg-slate-800 text-white"
              }`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === index + 1
                  ? "bg-amber-500 text-white"
                  : "bg-gray-300"
                }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === totalPages
                ? "bg-gray-300"
                : "bg-green-600 text-white"
              }`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>}
        <Model isOpen={isOpen} onOpenChange={onOpenChange} userId={userid}/>

      </div>
      <LoanAcceptForm
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        onSubmit={handleSubmit} // Pass the rejection submission handler
      /*userId={currentRejectUserId} // Pass the userId to RejectionOverlay
      usersId={currentRejectUsersId} */
      /></div></>): 
      (<>
      
      <div className="flex h-full min-h-screen w-screen">
       
      <div className="z-index-50 ">
        <Sidebar position={'absolute'} />
      </div>
      
      <div className=" flex items-center justify-center gradient-bg-transactions w-full">
      
      <LoanPre_Request/>
      </div>
       
      

      </div>
       </>)} 
    </>
  );
};

export default Loan;
