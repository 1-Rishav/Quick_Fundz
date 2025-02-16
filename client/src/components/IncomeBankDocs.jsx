import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { documents } from '../redux/slices/auth';
import CustomButton from './UI/CustomButton';

function IncomeBankDocs() {
    const [file , setFile] = useState("")
//const [message, setMessage] = useState("");
const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        //setMessage("");
        try {

          
          const formData = new FormData();
    formData.append('file', file);

    setFile("");

          dispatch(documents(formData));
          
          //setMessage("Loan Request submitted successfully.");
          
          
        } catch (error) {
          console.log(error);
          //setMessage("Error sending request data.",error);
        } 
      };

      const handleFileUpload = async ( e) => {
        setFile( e.target.files[0])
      }
   

  return (
    <div className="flex-1 flex-col flex items-center justify-center min-h-screen p-4 gradient-bg-transactions text-neutral-50">
        <h1 className=" w-full text-white flex items-center justify-center text-4xl font-bold mb-6 text-center">Income And Bank Statement</h1>
    <div className="gradient-bg-services text-neutral-50 p-8 rounded-2xl shadow-lg w-full max-w-lg">
      <h1 className="text-3xl font-bold  mb-6 text-center">
        Documents
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block  font-semibold mb-2">
            Eamil
          </label>
          <input
            type="file"
            accept=".pdf"
            placeholder="Choose docs."
            onChange={handleFileUpload}
            className="p-3 border text-white border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div
          type="submit"
          className=" text-white px-6 py-3 rounded-lg shadow-md w-full mb-4 transition"
        >
           <CustomButton button='Submit' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
        </div>
        {/* {message && (
          <div
            className={`text-center mt-4 ${
              message.startsWith("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )} */}
        </form>
    </div>
  </div>
  )
}

export default IncomeBankDocs