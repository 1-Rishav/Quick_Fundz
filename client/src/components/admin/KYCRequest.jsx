import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmOrRejectRequest, showKycRequest } from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
import Sidebar from '../Sidebar';
import RejectionOverlay from './RejectionOverlay';
import { GrDocumentPdf } from "react-icons/gr";


const KYCRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allRequest, setAllRequest] = useState(null);
  const [countRequest , setCountRequest] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentRejectUserId, setCurrentRejectUserId] = useState(null);
  const [currentRejectUsersId, setCurrentRejectUsersId] = useState(null);
  const usersPerPage = 8;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchKycRequests = async () => {
    try {
      const user = await dispatch(showKycRequest());
      setAllRequest(user.listOfRequest);
      setCountRequest(user.listOfRequest.length);
    } catch (error) {
      console.error("Error fetching KYC requests: ", error);
    }
  };

  useEffect(() => {
    fetchKycRequests();
  }, [dispatch]);

  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = allRequest ? allRequest.slice(firstIndex, lastIndex) : [];
  const totalPages = allRequest ? Math.ceil(allRequest.length / usersPerPage) : 0;

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleUserRemoval = (userId) => {
    const updatedRequestList = allRequest.filter((user) => user.id !== userId);
    setAllRequest(updatedRequestList);
  };

  const handleConfirm = async(userId, usersId, status) => {
    const data = { userId, usersId, status };
    dispatch(confirmOrRejectRequest(data));
    handleUserRemoval(userId);
    window.location.reload();
   await fetchKycRequests();
  };

  const handleReject = (userId, usersId) => {
    setCurrentRejectUserId(userId);
    setCurrentRejectUsersId(usersId);
    setIsOverlayOpen(true);
  };

  const handleSubmitRejection = async(message) => {
    const data = {
      userId: currentRejectUserId,
      usersId: currentRejectUsersId,
      status: 'Not verified',
      message
    };
    dispatch(confirmOrRejectRequest(data));
    handleUserRemoval(currentRejectUserId);
    window.location.reload();
    await fetchKycRequests();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col max-w-8xl mx-auto p-4 overflow-hidden gradient-bg-transactions">
        <h1 className="text-3xl font-bold text-center mb-8 text-neutral-50">KYC Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          

          
          {currentUsers.map((user, index) => (
            <div key={index} className='flex pb-2 flex-wrap flex-col items-center justify-end w-full h-full  rounded-2xl bg-white'> 
            <div  className="bg-white p-6 rounded-lg  flex flex-wrap flex-row gap-2 justify-between">
              <div >
                {/* <p className="text-lg font-semibold"><strong>Name:</strong> {user.name}</p> */}
                <p className="text-sm text-gray-600"><strong>Email:</strong> {user.email}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> {user.phone_number}</p>
                <p className="text-sm text-gray-600"><strong>Aadhar Number:</strong> {user.aadhar_number}</p>
                
              </div>
              <div>
              <p className="text-sm text-gray-600"><strong>Account Number:</strong> {user.bank_account_number}</p>
              <p className="text-sm text-gray-600"><strong>Ifsc Code:</strong> {user.ifsc_code}</p>
              </div>
              <div className='flex flex-col w-full h-full justify-start items-center'>
              <h1 className='text-lg font-bold'>Income Statement</h1>
              {user.document_file ? (
  <a href={user.document_file} target="_blank" rel="noopener noreferrer">
    <GrDocumentPdf size={35} />
  </a>
) : (
  <span className='font-semibold'>N/A</span>
)}
            </div>
                
            </div>
            <div className="flex flex-col flex-wrap sm:flex-row gap-2 mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition" onClick={() => handleConfirm(user.id, user.user_id, 'confirm')}>Confirm</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition" onClick={() => handleReject(user.id, user.user_id)}>Reject</button>
              </div>
            </div>
          ))}
            
            
          
        </div>

        {/* Pagination */}
       {countRequest>7 &&  <div className="flex justify-center mt-8 space-x-2">
          <button
            className={`px-4 py-2 rounded-full ${currentPage === 1 ? 'bg-gray-300' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 rounded-full ${currentPage === index + 1 ? 'bg-amber-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`px-4 py-2 rounded-full ${currentPage === totalPages ? 'bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'}`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>}
        
      </div>

      <RejectionOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        onSubmit={handleSubmitRejection}
        userId={currentRejectUserId}
        usersId={currentRejectUsersId}
      />
    </div>
  );
};

export default KYCRequest;
