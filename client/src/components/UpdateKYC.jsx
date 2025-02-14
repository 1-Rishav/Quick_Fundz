import { useState } from 'react';
//import { supabase } from '../supabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { rejectedkyc} from '../redux/slices/auth';
import CustomButton from './UI/CustomButton';

const UpdateKYC = () => {
  //const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [IFSCCode, setIFSCNumber] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const {user_id}=useSelector((state)=>state.auth);
console.log(user_id)
  const data={
    //email:email,
    phoneNumber:phoneNumber,
    aadharNumber:aadharNumber,
    userId:user_id,
    bankNumber:bankNumber,
    IFSCCode:IFSCCode,
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(rejectedkyc(data))
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      <div className="gradient-bg-services p-6 md:p-8 rounded-lg shadow-lg max-w-sm w-full sm:max-w-md lg:max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center text-neutral-100 mb-6">Submit Your KYC Details</h1>
        <p className="text-neutral-100 mb-6 text-center">
          <span className="font-semibold">Know Your Customer (KYC)</span> is a critical process for verifying your identity and ensuring the security and compliance of our platform. By providing your KYC details, you help us maintain a safe environment for all users and comply with regulatory standards.
        </p>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-neutral-100 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-100 mb-2">Aadhar Number</label>
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-100 mb-2">Bank Account Number</label>
            <input
              type="number"
              value={bankNumber}
              onChange={(e) => setBankNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-100 mb-2">IFSC Code</label>
            <input
              type="text"
              value={IFSCCode}
              onChange={(e) => setIFSCNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 rounded-lg w-full font-semibold"
          >
            <CustomButton button='Submit' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateKYC;
