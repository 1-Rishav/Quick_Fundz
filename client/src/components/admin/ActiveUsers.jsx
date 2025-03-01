import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../BuildFunction/DeleteIcon";
import { EditIcon } from "../BuildFunction/EditIcon";

import Sidebar from '../Sidebar';
import { activeUser, adminUpdateCurrent_user ,deleteUser} from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const statusColorMap = {
  verified: "success",
  'Not verified': "danger",
  pending: "warning",
  confirm: "primary",
  'NULL': "danger",
};

const role = {
  user:"primary",
  admin:"success"
}


const ActiveUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allRequest, setAllRequest] = useState([]);
  const [countActiveUser, setCountActiveUser] = useState(null);
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

    useEffect(() => {
      const fetchKycDetails = async () => {
        
          const allUser = await dispatch(activeUser());
           setAllRequest(allUser.users);
       
      };
  
      fetchKycDetails();
  
  }, [showInput, inputId,inputValue]);
  
  const handleInputChange = (e) => {
    e.preventDefault();
    setInputValue(e.target.value)
  }

  const handleUpdate = (userId) => {
    const data = {
      inputValue: inputValue,
      userId: userId
    }
    dispatch(adminUpdateCurrent_user(data))
    setInputValue(null);
    setShowInput(false);
  }
  useEffect(() => {
    const fetchKycDetails = async () => {
      try {
        const allUser = await dispatch(activeUser());
        setAllRequest(allUser.users);
        setCountActiveUser(allUser.users.length)
        toast.success(allUser.message)
      } catch (error) {
toast.error(error.allUser.message)      } finally {
        setLoading(false);
      }
    };

    fetchKycDetails();
  }, [dispatch]);

  const handleDelete = async(userId)=>{
    const data = {
      userId
    }
    try {
      await dispatch(deleteUser(data))
    } catch (error) {
      console.log(error)
    }
  }
  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = allRequest.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(allRequest.length / usersPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
//console.log(currentUsers.length);
/* useEffect(() => {
  const checkUser =()=>{
    for(let i=0;i<currentUsers.length ;i++){
      for(let j=0;j<kycUsers.length;j++){
        if(currentUsers[i].id===kycUsers[j].user_id){
          return true;
        }
      }
     }
     return false;
  }
  const isUserMatched = checkUser();
  console.log(isUserMatched)
  
}, ) */
  
  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    
    
    switch (columnKey) {
      case "id":
        
      return (
        <Chip
        className='cursor-pointer'
        color={user.id==user.kyc_usersuser_id || user.id==user.investor_usersuser_id || user.id==user.loan_usersuser_id || user.id==user.repayment_userusers_id?  'success':'danger'}
        
        title={user.id==user.kyc_usersuser_id || user.id==user.investor_usersuser_id || user.id==user.loan_usersuser_id || user.id==user.repayment_userusers_id? ('Active User'):'Passive User'}
        size='sm'
        variant='flat'
        >
          {user.id}
        </Chip>
      );
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

      case "password":
        return user.password.length>20 ? user.password.substring(0,15)+'...':<span className='flex flex-col '>{user.password}</span>;
      case "role":
        return <Chip color={role[user.role]} size="sm" variant="flat">
        {user.role}
      </Chip>
      
      case "message":
        return (showInput && inputId==user.id) ? (<div key={user.id} className='flex flex-col justify-center gap-2'><textarea placeholder={user.user_id} className='w-30  border rounded p-1 border-solid-2 border-red-500' autoFocus onChange={handleInputChange} rows='4'/> <div className='flex flex-row items-center justify-center gap-4'> <button className='border rounded p-1 max-w-fit text-white bg-slate-800 hover:bg-slate-400' onClick={() => {setShowInput(false);setInputValue(null);}}>Cancel</button> <button onClick={() => handleUpdate(user.id)} className={`border rounded p-1 max-w-fit text-white  ${inputValue  ? 'bg-slate-800 hover:bg-slate-400' : 'bg-slate-200 cursor-not-allowed'}  `} disabled={!inputValue} >Update</button></div></div>) : <span>{user.message}</span>;
     /*  case "ifsc_code":
        return <span>{user.ifsc_code}</span>; */
      case "status":
        return (
          <Chip color={statusColorMap[user.is_verified ?? 'NULL']} size="sm" variant="flat">
            {user.is_verified ?? 'NULL'}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex  text-lg gap-4">
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
             <Tooltip content="Delete user" color="danger">
              <span
                className="cursor-pointer text-danger"
                onClick={() => handleDelete(user.id)}
              >
                <DeleteIcon/>
              </span>
            </Tooltip> 
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 max-w-8xl mx-auto p-4 overflow-auto gradient-bg-transactions">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left text-white flex items-center justify-center">Active Users</h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Table aria-label="KYC Details"  >

            <TableHeader columns={[
              { name: "ID", uid: "id" },
              { name: "Profile", uid: "name" },
              { name: "Email", uid: "email" },
              { name: "Password", uid: "password" },
              { name: "Role", uid: "role" },
              //{ name: "User ID", uid: "user_id" },
              //{ name: "Verified", uid: "verified" },
              //{ name: "Bank Account", uid: "bank_account_number" },
              { name: "Message", uid: "message" },
              { name: "KYC Status", uid: "status" },
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
       {countActiveUser>7 && <div className="flex justify-end mt-6 space-x-2">
          <div
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'}`}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </div>

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

export default ActiveUsers;
