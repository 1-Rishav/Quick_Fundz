import { useState, useEffect, useRef } from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminMessage, LogoutUser } from '../redux/slices/auth';
import  frontImg from '../assets/peer-to-peer.jpg'
import MileStones from './MileStones';
import ReasonToJoin from './ReasonToJoin';
import { BackgroundBeamsWithCollisionDemo } from './Footer_BeamsCollision';
import UserProfile from './UserProfile';
import ProfileModal from './ProfileModal';
import { CarouselDemo } from '../components/Carousel';

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showMessage, setShowMessage] = useState([]);
  const [open , setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(""); // State to store avatar URL
  const [mile , setMile] = useState(null);

  const platformInfo= (...args)=>{
   setMile(...args);
  }
  

  const handleAvatarChange = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl); // Update avatar URL
  };
  const popupRef = useRef(null); 

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(LogoutUser());
    navigate("/auth/home");
  };
  const handleOpen = ()=>{
    setOpen(prevState=>!prevState)
}


  
  const handleNotificationClick = () => {
    setShowPopup((prev) => !prev);   
    
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
       
      }
    };
    const fetchMessage= async()=>{
      const messages =await dispatch(adminMessage());
      setShowMessage(messages)
    }
    fetchMessage();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
    };
  }, [showPopup]);

  return (
    <>
      <nav className="flex justify-between items-center bg-gray-300 p-4 text-black shadow-md">
        <h1 className="text-xl font-bold">Quick Fundz</h1>
        <div className="flex items-center">
          <div className="relative inline-block mr-4">
            <button 
              onClick={handleNotificationClick} 
              className="flex items-center justify-center p-2 text-black hover:bg-gray-200 rounded-full"
            >
              <IoIosNotificationsOutline size={28} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">{showMessage? '1':'0'}</span>
            </button>
            {showPopup && (<>
              <div ref={popupRef} className="absolute top-12 right-0 w-64 p-4 bg-white border rounded shadow-lg z-50">
                <p className="text-black">{showMessage}</p>
              </div>
              </>
            )}
          </div>
          <UserProfile avatarUrl={avatarUrl} handleOpen={handleOpen}/>
          
        </div>
      </nav>
      {open && (
        <div className='h-52 w-full flex items-end justify-center  mt-1 flex-col absolute z-50'>
          <div className='h-52 w-[16rem] bg-gray-50 flex flex-col justify-start items-start rounded-xl mr-5 '>
          <ProfileModal onAvatarChange={handleAvatarChange}/>
          <button 
            type='submit' 
            onClick={()=>{navigate('/investor_investment')}} 
            className=" flex w-full  bg-gray-300 px-4 py-2 mt-2 hover:bg-gray-200"
          >
            Your Investment
          </button>
          <button 
            type='submit' 
            onClick={handleLogout} 
            className=" flex w-full  bg-gray-300 px-4 py-2 mt-2 hover:bg-gray-200"
          >
            Logout
          </button>
          </div>
        </div>
      )} 
      <div className="flex h-screen w-full  overflow-hidden">
        <div className="z-index-50 absolute">
          <Sidebar position={'relative'}/>
        </div>
        <div className="relative h-screen w-screen   gradient-bg-welcome  ">
          <div className='flex flex-wrap justify-between items-center h-[85vh] w-full object-contain'>
          <div className="relative ml-28 flex flex-col items-start justify-center h-fit w-fit text-neutral-100">
            <h1 className="text-4xl font-bold ">Your Financial Needs, Our Trusted Solution.</h1>
            <p className="text-xl mt-4">Simplifying borrowing and lending, one connection at a time.Bringing lenders and <br/> borrowers together for mutual growth.</p>
          </div>
          <div className='relative  flex flex-wrap justify-center items-center xl:top-16 ml-24 md:w-full 2xl:w-[38%] sm:h-[50%] h-[30%] '>
            <img src={frontImg} alt="Peer to peer img" className='rounded-xl h-[100%] sm:h-[100%] 2xl:w-[90%] '/>
          </div>
          </div>
          <div className=' max-md:hidden flex flex-wrap items-center  justify-center gap-3'>
          <div className=' p-2 white-glassmorphism flex items-center justify-center gap-2 text-neutral-100 text-2xl  h-fit w-fit'>
            <h3>Secure Digitised Processes | </h3>
            <h3>Transforming Financial Opportunities | </h3>
            <h3>Earn More with Your Savings</h3>
          </div>
          </div>
          
        </div>
      </div>
      <div className='pb-28 relative h-full w-full gradient-bg-transactions text-neutral-50'>
        <MileStones platformMile={mile}/>
          <ReasonToJoin handleDetail={platformInfo}/>
         <CarouselDemo/>
         <BackgroundBeamsWithCollisionDemo/>
        </div>
    </>
  );
};

export default Menu;
