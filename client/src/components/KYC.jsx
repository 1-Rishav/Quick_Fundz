import { useState } from 'react';
//import { supabase } from '../supabaseClient';
import { UserKyc } from '../redux/slices/auth';
import { useDispatch } from 'react-redux';
import CustomButton from './UI/CustomButton';

const KYC = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [IFSCCode, setIFSCNumber] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const data = {
    email,
    phoneNumber,
    aadharNumber,
    bankNumber,
    IFSCCode,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(UserKyc(data));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gradient-bg-transactions p-2">
      <div className="gradient-bg-services  p-4 rounded-xl shadow-lg w-full sm:max-w-md lg:max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-3">Submit Your KYC Details</h1>
        <p className="text-gray-200 mb-3 text-center text-sm">
          <span className="font-semibold">Know Your Customer (KYC)</span> is a critical process for verifying your identity and ensuring security.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          
          <div>
            <label className="block text-sm font-semibold text-gray-100 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-100 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-100 mb-1">Aadhar Number</label>
            <input
              type="number"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-100 mb-1">Bank Account Number</label>
            <input
              type="number"
              value={bankNumber}
              onChange={(e) => setBankNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-100 mb-1">IFSC Code</label>
            <input
              type="text"
              value={IFSCCode}
              onChange={(e) => setIFSCNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div
            type="submit"
            className=" text-white py-2 px-4 rounded-lg w-full font-semibold  transition"
          >
             <CustomButton button='Submit' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYC;
