import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, input } from "@nextui-org/react";
import { EditIcon } from "../BuildFunction/EditIcon";

import Sidebar from '../Sidebar';
import {investedUsers,updateInvestedUser } from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
//import axios from 'axios';

const statusColorMap = {
  provider: "warning",
  paid: "success",
  processing: "danger",
};


const InvestedUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allRequest, setAllRequest] = useState([]);
  const[countInvestor , setCountInvestor] = useState(null)
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputId , setInputId] = useState(null);
  const [inputValue, setInputValue] = useState(null)
  const dispatch = useDispatch();
  const usersPerPage = 10;

  const handleEdit = (userId) => {
    setShowInput(true);
    setInputId(userId)

  }
  const handleInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value)
  }

  const handleUpdate = (userId,userID) => {
    const data = {
      inputValue: inputValue,
      userId: userId,
      userID: userID,
    }
    dispatch(updateInvestedUser(data))
    setShowInput(false);
    setInputValue(null);
  }

  useEffect(()=>{

    const fetchKycDetails = async () => {
      
        const allInvestor = await dispatch(investedUsers());
        setAllRequest(allInvestor.investorDetail);
       
      
    };

    fetchKycDetails();
  },[showInput,inputValue,inputId])


  useEffect(() => {

    
    const fetchKycDetails = async () => {
      try {
        const allInvestor = await dispatch(investedUsers());
        setAllRequest(allInvestor.investorDetail);
        setCountInvestor(allInvestor.investorDetail.length)
        toast.success(allInvestor.message)
      } catch (error) {
toast.error(error.allInvestor.message)      } finally {
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
            avatarProps={{ radius: "md", src: user.avatar_url }}

            name={cellValue}
          >

          </User>
        );
      case "email":
        return <span>{user.email}</span>

      case "amount":
        return <span>{user.amount}</span>;
      case "duration":
        return <span>{user.duration}</span>;
      case "rate_of_interest":
       return <span>{user.rate_of_interest}</span>;
      /* case "verified":
        return <span>{user.is_verified }</span>; */
      case "user_id":
        return showInput && inputId=== user.id ? (<div className='flex flex-col justify-center gap-2'><input placeholder={user.user_id} className='w-14 border rounded p-1 border-solid-2 border-red-500' autoFocus onChange={handleInputChange} /> <div className='flex flex-row items-center justify-center gap-4'> <button className='border rounded p-1 max-w-fit text-white bg-slate-800 hover:bg-slate-400' onClick={() =>{ setShowInput(false);setInputValue(null)}}>Cancel</button> <button onClick={() => handleUpdate(user.id,user.user_id)} className={`border rounded p-1 max-w-fit text-white ${inputValue? 'bg-slate-800 hover:bg-slate-400' : 'bg-slate-200 cursor-not-allowed'}  `} disabled={!inputValue }>Update</button></div></div>) : <span>{user.user_id}</span>;
      case "status":
        return (
          <Chip color={statusColorMap[user.invest_status]} size="sm" variant="flat">
            {user.invest_status}
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
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left text-white flex items-center justify-center">Investors</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Table aria-label="KYC Details"  >

            <TableHeader columns={[
              { name: "ID", uid: "id" },
              { name: "Name", uid: "name" },
              { name: "Email", uid: "email" },
              { name: "Amount", uid: "amount" },
              { name: "Duration", uid: "duration" },
              { name: "R.O.I", uid: "rate_of_interest" },
              //{ name: "Verified", uid: "verified" },
              { name: "User ID", uid: "user_id" },
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
       {countInvestor>7 && <div className="flex justify-end mt-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'}`}
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
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'}`}
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

export default InvestedUsers;
