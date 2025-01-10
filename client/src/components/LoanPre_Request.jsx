import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loanPreRequest } from '../redux/slices/auth';

function LoanPre_Request() {
    const [email , setEmail] = useState("")
    const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const {user_id:userId} = useSelector((state)=>state.auth)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = { email, amount, duration, interestRate,userId };
      dispatch(loanPreRequest(data));
      
      setMessage("Loan Request submitted successfully.");
      setEmail("");
      setAmount("");
      setDuration("");
      setInterestRate("");
    } catch (error) {
      setMessage("Error sending request data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async ( e) => {
    setEmail(e.target.value)
  }
  const handleChangeAmount = async ( e) => {
    setAmount(e.target.value)
  }
  const handleChangeDuration = async ( e) => {
    setDuration(e.target.value)
  }
  const handleChangeROI = async ( e) => {
    setInterestRate(e.target.value)
  }

  return (
    <div className="flex-1 flex-col flex items-center justify-center min-h-screen p-4 gradient-bg-transactions text-neutral-50">
        <h1 className=" w-full text-white flex items-center justify-center text-4xl font-bold mb-6 text-center">Submit Your Request</h1>
    <div className="gradient-bg-services text-neutral-50 p-8 rounded-2xl shadow-lg w-full max-w-lg">
      <h1 className="text-3xl font-bold  mb-6 text-center">
        Investment Form
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block  font-semibold mb-2">
            Eamil
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleChangeEmail}
            className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block  font-semibold mb-2">
            Amount (max= 5,00,000)
          </label>
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={handleChangeAmount}
            className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block  font-semibold mb-2">
            Duration (in months)
          </label>
          <input
            type="text"
            placeholder="Enter duration (e.g., 2 months)"
            value={duration}
            onChange={handleChangeDuration}
            className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block  font-semibold mb-2">
            Interest Rate (%)
          </label>
          <input
            type="text"
            placeholder="Enter interest rate (e.g., 5%)"
            value={interestRate}
            onChange={handleChangeROI}
            className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md w-full mb-4 hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {message && (
          <div
            className={`text-center mt-4 ${
              message.startsWith("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  </div>
    
  )
}

export default LoanPre_Request