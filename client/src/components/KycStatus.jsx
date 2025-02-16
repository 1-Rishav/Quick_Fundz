import {useDispatch, useSelector} from 'react-redux';
import { verifiedKyc } from '../redux/slices/auth';
import { useNavigate } from 'react-router-dom';
import CustomButton from './UI/CustomButton';
const KYCStatus = () => {
  const {verificationStatus,user_id,kycMessage}=useSelector((state)=>state.auth)
  const navigate = useNavigate();

  let status;
  if(verificationStatus ==='pending'){
     status = 'pending';
  }
   if(verificationStatus ==='confirm'){
    status ='Approved';
  }

  if(verificationStatus ==='Not verified'){
    status = 'Rejected'
  }
    
   

  const statusMessage = () => {
    if (status === 'Approved') {
      return { message: 'Your KYC is Approved.', bgColor: 'bg-green-100', textColor: 'text-green-600' };
    } else if (status === 'Rejected') {
      return { message: `Your KYC was Rejected. (${kycMessage})`, bgColor: 'bg-red-100', textColor: 'text-red-600' };
    } else {
      return { message: 'Your KYC is Pending. We will notify you once it is processed.', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
    }
  };

  const { message, bgColor, textColor } = statusMessage();
  const dispatch = useDispatch();
  const handleClick = async (status) => {
    const data={
      status:status,
      user_id:user_id
    }
    dispatch(verifiedKyc(data))
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  gradient-bg-transactions p-4">
      <div className={`p-6 md:p-8 rounded-lg shadow-lg max-w-sm w-full sm:max-w-md lg:max-w-lg mx-auto ${bgColor}`}>
        <h1 className={`text-3xl font-bold text-center mb-6 ${textColor}`}>KYC Status</h1>
        <p className={`text-lg text-center font-semibold ${textColor}`}>{message}</p>
        <div className="mt-8 text-center">
          {status === 'Rejected' && (
            <div onClick={() => navigate('/auth/updatekyc')} className=" py-2 px-4 rounded-lg w-full font-semibold  transition">
              <CustomButton button='Update Details' textColor='text-green-400' bottomColor='via-amber-500' rgbColor='rgba(220, 211, 43,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
            </div>
          )}
        </div>
        <div className="mt-8 text-center">
          {status === 'Approved' && (
            <div onClick={()=>handleClick('verified')} className="  py-2 px-4 rounded-lg w-full font-semibold  transition">
              <CustomButton button='Explore' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCStatus;
