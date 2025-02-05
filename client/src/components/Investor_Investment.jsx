import  { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import {allInvest} from '../redux/slices/auth'

const Investor_Investment = () => {

    const [currentPage, setCurrentPage] = useState(1);
      const [filteredLoans, setFilteredLoans] = useState([]);
    const [countInvestment , setCountInvestment] = useState(null);

  const dispatch = useDispatch();
      const loansPerPage = 5;

     useEffect(() => {
        const fetchLoans = async () => {
          try {
            const InvestorDetail = await dispatch(allInvest());
            const result = await InvestorDetail;
            setCountInvestment(InvestorDetail.data.length);
            if (result?.status === "success" && Array.isArray(result?.data)) {
              setFilteredLoans(result?.data);
            } else {
              console.error("Unexpected data format:", result);
            }
          } catch (error) {
            console.error("Error fetching loans:", error);
          }
        };
    
        fetchLoans();
      }, [dispatch]);

    const lastIndex = currentPage * loansPerPage;
  const firstIndex = lastIndex - loansPerPage;
  const currentLoans = filteredLoans.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
    
      <div className="flex h-full min-h-screen overflow-hidden">
      <div className="z-index-50 max-sm:absolute">
        <Sidebar />
      </div>
      <div className="flex max-sm:ml-8 flex-col flex-1 max-w-8xl mx-auto p-4 overflow-y-auto relative gradient-bg-transactions text-neutral-50">
         <h1 className="text-2xl font-bold mb-6 text-center">Investment</h1>   
          
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentLoans.map((loan, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg flex flex-wrap justify-between items-center gradient-bg-services"
            >
              <div className="relative w-fit h-fit flex flex-wrap flex-col">
                
                <p>
                  <strong>Email:</strong> {loan.email}
                </p>
                <p>
                  <strong>Amount:</strong> {loan.amount}
                </p>
              </div>
              <div className="relative w-fit h-fit flex flex-wrap flex-col gap-4">
                <p>
                  <strong>Duration:</strong> {loan.duration}
                </p>
                <p>
                  <strong>Interest Rate:</strong> {loan.rate_of_interest}
                </p>
              </div>
             
            </div>
          ))}
        </div>
         {countInvestment>4 &&  <div className="flex justify-end mt-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === 1 ? "bg-gray-300" : "bg-slate-800 text-white"
              }`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === index + 1
                  ? "bg-amber-500 text-white"
                  : "bg-gray-300"
                }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`px-4 py-2 rounded-full cursor-pointer ${currentPage === totalPages
                ? "bg-gray-300"
                : "bg-green-600 text-white"
              }`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>}
      </div>
      </div> 
    </>
  )
}

export default Investor_Investment