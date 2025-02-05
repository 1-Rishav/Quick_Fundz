import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { investmentEntry } from "../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";

const Invest = () => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const {user_id:userId} = useSelector((state)=>state.auth)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { amount, duration, interestRate,userId };
      dispatch(investmentEntry(data));
      setAmount("");
      setDuration("");
      setInterestRate("");
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAmount = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");

    setAmount(value);
    const amountPattern = /^\d+$/;
    if (value === "" || amountPattern.test(value)) setError("");
    else setError("Please enter a valid amount.");
    if(value>500000){
      setAmount(500000);
    }
  };

  const handleBlurAmount = () => {
    if (amount) setAmount(`₹ ${amount}`);
  };

  const handleFocusAmount = () => {
    setAmount(amount.replace("₹ ", ""));
  };

  const handleChangeDuration = (e) => {
    const value = e.target.value;
    setDuration(value);
    const durationPattern = /^(\d+)\s*(month|months|day|days|year|years)$/i;
    if (value === "" || durationPattern.test(value)) setError("");
    else setError("Please enter a valid duration.");
  };

  const handleBlurDuration = () => {
    if (duration) setDuration(`${duration} month`);
  };

  const handleFocusDuration = () => {
    setDuration(duration.replace('month', ''));
  };

  const handleChangeInterest = (e) => {
    const value = e.target.value.replace('%', '');
    const ratePattern = /^(100(\.0{1,2})?|[1-9]?[0-9](\.[0-9]{1,2})?)$/;
    if (value === "" || ratePattern.test(value)) {
      setInterestRate(value);
      setError("");
    } else {
      setError("Enter a valid interest rate.");
    }
  };

  const handleBlur = () => {
    if (interestRate) setInterestRate(`${interestRate} %`);
  };

  const handleFocus = () => {
    setInterestRate(interestRate.replace('%', ''));
  };

  return (
    <div className="flex  h-full min-h-screen">
      <div className="z-index-50">
        <Sidebar position={'absolute'}/>
      </div>
      <div className="flex-1 flex items-center justify-center h-full min-h-screen p-4 gradient-bg-transactions text-neutral-50">
        <div className="gradient-bg-services h-full text-neutral-50 p-8 rounded-2xl shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold  mb-6 text-center">
            Invest
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block  font-semibold mb-2">
                Amount (max= 5,00,000)
              </label>
              <input
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={handleChangeAmount}
                onBlur={handleBlurAmount}
                onFocus={handleFocusAmount}
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
                onBlur={handleBlurDuration}
                onFocus={handleFocusDuration}
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
                onChange={handleChangeInterest}
                onBlur={handleBlur}
                onFocus={handleFocus}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Invest;
