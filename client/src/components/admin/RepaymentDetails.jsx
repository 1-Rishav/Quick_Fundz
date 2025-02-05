import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip } from "@nextui-org/react";
import { EditIcon } from "../BuildFunction/EditIcon";

import Sidebar from '../Sidebar';
import {allRepaymentData ,updateRepaymentData} from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
//import axios from 'axios';

const statusColorMap = {
  Paid: "success",
  "Not-paid": "danger",
  
};


const RepaymentDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allRequest, setAllRequest] = useState([]);
  const [countRepay , setCountRepay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputId , setInputId] = useState(null);

  const [inputValue, setInputValue] = useState(null)
  const dispatch = useDispatch();
  const usersPerPage = 10;

  const handleEdit = (userId) => {
    setShowInput(true);
    setInputId(userId);
  }
  const handleInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value)
  }

  const handleUpdate = (userId,userID) => {
    const data = {
      inputValue: inputValue,
      userId: userId,
      userID: userID
    }
    dispatch(updateRepaymentData(data))
    setShowInput(false);
    setInputValue(null);
  }
  useEffect(() => {
    const fetchKycDetails = async () => {
      
        const repayment = await dispatch(allRepaymentData());
        setAllRequest(repayment.repaymentDetail);
        
    };

    fetchKycDetails();
  }, [showInput,inputId, inputValue]);

  useEffect(() => {
    const fetchKycDetails = async () => {
      try {
        const repayment = await dispatch(allRepaymentData());
        setAllRequest(repayment?.repaymentDetail);
        setCountRepay(repayment?.repaymentDetail?.length);
      } catch (error) {
        console.error("Error fetching KYC details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKycDetails();
  }, [dispatch]);


  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = allRequest.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(allRequest.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "id":
        return <span>{user.id}</span>
      case "name":
        return (
          <User
            avatarProps={{ radius: "md", src: user.avatar }}

            name={cellValue}
          >

          </User>
        );
      case "user_id":
        return showInput && inputId === user.id ? (<div className='flex flex-col justify-center gap-2'><input placeholder={user.repayment_user_id} className='w-14 border rounded p-1 border-solid-2 border-red-500' autoFocus onChange={handleInputChange} /> <div className='flex flex-row items-center justify-center gap-4'> <button className='border rounded p-1 max-w-fit text-white bg-slate-800 hover:bg-slate-400' onClick={() =>{ setShowInput(false);setInputValue(null)}}>Cancel</button> <button onClick={() => handleUpdate(user.id,user.repayment_user_id)} className={`border rounded p-1 max-w-fit text-white ${inputValue  ? 'bg-slate-800 hover:bg-slate-400' : 'bg-slate-200 cursor-not-allowed'}  `} disabled={!inputValue }>Update</button></div></div>) : <span>{user.repayment_user_id}</span>;

      case "Loan Amount":
        return <span>{user.loan_amount}</span>;
      
      /* case "verified":
        return <span>{user.is_verified }</span>; */
      case "interest_Amount":
        return <span>{user.interest_amount}</span>;
      case "remain_Days":
        return <span>{user.remain_days}</span>;
      case "investor_user_id":
        return <span>{user.provider_user_id}</span>;
      case "paid_time":
        return <span>{user.paid_time}</span>;
      case "pay_option":
        return <span>{String(user.enable_pay)}</span>;
      case "status":
        return (
          <Chip color={statusColorMap[user.payment_status]} size="sm" variant="flat">
            {user.payment_status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex  text-lg gap-2">
            {/* <Tooltip content="Details">
              <span className="cursor-pointer">
                <EyeIcon />
              </span>
            </Tooltip> */}
            <Tooltip content="Edit user" color="warning">
              <span className="cursor-pointer">
                <EditIcon className='text-yellow-300' onClick={() => handleEdit(user.id)} />
              </span>
            </Tooltip>
            {/* <Tooltip content="Delete user" color="danger">
              <span
                className="cursor-pointer text-danger"
                onClick={() => deleteUser(user.user_id)}
              >
                <DeleteIcon/>
              </span>
            </Tooltip> */}
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 max-w-8xl mx-auto p-4 overflow-auto gradient-bg-transactions ">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left text-neutral-50 flex items-center justify-center">RePayment Details</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Table aria-label="KYC Details"  >

            <TableHeader columns={[
              { name: "ID", uid: "id" },
              { name: "Name", uid: "name" },
              { name: "Borrower ID", uid: "user_id" },
              { name: "Loan Amount", uid: "Loan Amount" },
              { name: "Repay Amount", uid: "interest_Amount" },
              { name: "Remain Days", uid: "remain_Days" },
              //{ name: "Verified", uid: "verified" },
              { name: "Investor UserID", uid: "investor_user_id" },
              { name: "Paid Time", uid: "paid_time" },
              { name: "Pay Option", uid: "pay_option" },
              { name: "Status", uid: "status" },
              { name: "Actions", uid: "actions" }
            ]} >
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className='border-b-2  border-gray-600'>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={currentUsers} >
              {(user) => (
                <TableRow key={user.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(user, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}

            </TableBody>
          </Table>
        )}


        {/* Pagination */}
       {countRepay>7 &&  <div className="flex justify-end mt-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-full ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-slate-800 text-white'}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-4 py-2 rounded-full ${currentPage === index + 1 ? 'text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold' : 'bg-gray-300'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={`px-4 py-2 rounded-full ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 text-white'}`}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>}
      </div>
    </div>
  );
};

export default RepaymentDetails;
