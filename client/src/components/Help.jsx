import  { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {motion} from 'motion/react'
import CustomButton from './UI/CustomButton';
import { toast } from 'react-toastify';

const Help = () => {

    const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    toast.info("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "96528286-fbec-4566-94d0-a9c14dfab4cb");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Query Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      toast.error(data.message);
    }
  };

  return (
    <>
    
      <div className="flex h-full min-h-screen ">
      
      <div className="flex-1 flex items-center justify-center h-full min-h-screen p-4 gradient-bg-transactions text-neutral-50">
        <div className="gradient-bg-services h-full text-neutral-50 p-8 rounded-2xl shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold  mb-6 text-center">
            Help Desk
          </h1>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block  font-semibold mb-2">
                Enter name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                
                className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block  font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                
                className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block  font-semibold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="number"
                placeholder="Enter your number"
                
                className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block  font-semibold mb-2">
                Message
              </label>
              <textarea
                type="text"
                name="message"
                placeholder="Enter your query"
                
                className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div
              type="submit"
              className="px-6 py-3 rounded-lg shadow-md w-full mb-4"
            >
              <CustomButton button='Submit' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
            </div>
          </form>
          
        </div>
      
       
    </div>
      </div>
    </>
  )
}

export default Help