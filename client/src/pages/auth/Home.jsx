import { Link } from "react-router-dom";
import CustomButton from "../../components/UI/CustomButton";

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 via-white to-blue-100 relative">
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 top-10 left-20 animate-blob"></div>
      <div className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 bottom-20 right-20 animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10 text-center p-8">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-800 drop-shadow-lg">
          Welcome to <span className="text-blue-600">QuickFundz</span>
        </h1>
        <p className="mb-8 text-lg text-gray-700 max-w-md mx-auto drop-shadow">
          The smarter way to fund your dreams. Sign up now and start your journey with us!
        </p>
        <div className="space-x-4 flex justify-center items-center">
          <Link 
            to="/auth/signup" 
            className="px-6 py-3 text-white rounded-full transform transition duration-300 hover:-translate-y-1"
          >
           <CustomButton button='Signup' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-32 rounded-lg p-3 bg-black text-neutral-100'/>
          </Link>
          <Link 
            to="/auth/login" 
            className="px-6 py-3 text-white rounded-full transform transition duration-300 hover:-translate-y-1"
          >
            <CustomButton button='Login' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-32 rounded-lg p-3 bg-black text-neutral-100'/>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
