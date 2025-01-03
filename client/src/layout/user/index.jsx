import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


const UserLayout = () => {
  const {isLoggedIn,role,verificationStatus,verified} = useSelector((state)=>state.auth)
  
  if(isLoggedIn){
    if(role === "admin"&& verificationStatus==="verified" && verified === true){
     return <Navigate to="/admin"/>;
   }
  }

    if(!isLoggedIn){
    return <Navigate to="/auth/home"/>
  }  
  
  return (
    <>
      <Outlet />
    </>
  );
};

export default UserLayout;