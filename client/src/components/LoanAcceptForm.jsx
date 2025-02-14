import React, { useState } from 'react';
import CustomButton from './UI/CustomButton';
import { RxCross2 } from 'react-icons/rx';

const LoanAcceptForm = ({ isOpen, onClose, onSubmit}) => {
  
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async() => {
    
    onSubmit(amount,duration,interestRate);
    onClose();
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

  const handleClose=()=>{
    onClose();
  }

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="gradient-bg-services rounded-lg p-6 shadow-lg w-full max-w-md mx-4 md:mx-0">
        <div className='w-full h-fit flex justify-end items-center'>
        <button className='text-white w-10 h-fit flex text-center justify-center items-center p-2 hover:bg-gray-700 rounded-full' onClick={handleClose}><RxCross2 size={22} /></button></div>
        <h2 className="text-xl font-semibold mb-4 text-center text-neutral-100">Negotiation Request</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-neutral-100 text-sm font-semibold mb-1">
                Your Amount
              </label>
              <input
  type="text"
  placeholder="Enter amount"
  value={amount}
  onChange={handleChangeAmount}
  onBlur={handleBlurAmount}
  onFocus={handleFocusAmount}
  className="p-3 border border-gray-300 rounded-lg w-full"
  required
/>
            </div>
            <div className="mb-4">
              <label className="block text-neutral-100 text-sm font-semibold mb-1">
               Your Duration (in months)
              </label>
              <input
                type="text"
                placeholder="Enter duration (e.g., 2 )"
                value={duration}
                onChange={handleChangeDuration}
                onBlur={handleBlurDuration}
        onFocus={handleFocusDuration}
                className="p-3 border border-gray-300 rounded-lg w-full"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-neutral-100 text-sm font-semibold mb-1">
               Your Interest Rate (%)
              </label>
              <input
        type="text"
        placeholder="Enter interest rate (e.g., 5)"
        value={interestRate}
        onChange={handleChangeInterest}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="p-3 border border-gray-300 rounded-lg w-full"
        required
      />
            </div>
            <div
            type='submit'
              
              className=" px-6 py-3 rounded-lg shadow-md w-full mb-4 transition"
            >
              <CustomButton button='Submit' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
            </div>
            {loading && (
              <div className="text-center text-blue-500 mt-4">Loading...</div>
            )}
            {message && (
              <div
                className={`text-center mt-4 ${
                  message.startsWith("Error")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {message}
              </div>
            )}
          </form>
      </div>
    </div>
  );
};

export default LoanAcceptForm;