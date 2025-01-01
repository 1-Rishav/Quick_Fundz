import { useState, useEffect, useRef } from 'react';
import { IoIosNotificationsOutline } from "react-icons/io";
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminMessage, LogoutUser } from '../redux/slices/auth';
import  frontImg from '../assets/peer-to-peer.jpg'
import MileStones from './MileStones';
import ReasonToJoin from './ReasonToJoin';
import { AppleCardsCarouselDemo } from '../components/Carousel';
import { BackgroundBeamsWithCollisionDemo } from './Footer_BeamsCollision';

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showMessage, setShowMessage] = useState([]);
  const popupRef = useRef(null); 

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(LogoutUser());
    navigate("/auth/home");
  };

  
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
      <nav className="flex justify-between items-center bg-white p-4 text-black shadow-md">
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
          <button 
            type='submit' 
            onClick={handleLogout} 
            className="ml-4 bg-white px-4 py-2 rounded-xl hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="flex h-screen w-full  overflow-hidden">
        <div className="z-index-50 absolute">
          <Sidebar />
        </div>
        <div className="relative h-screen w-screen   gradient-bg-welcome  ">
          <div className='flex flex-wrap justify-between items-center h-[85vh] w-screen object-contain'>
          <div className="relative left-28 flex flex-col items-start justify-center h-full text-neutral-100">
            <h1 className="text-4xl font-bold ">Your Financial Needs, Our Trusted Solution.</h1>
            <p className="text-xl mt-4">Simplifying borrowing and lending, one connection at a time.Bringing lenders and <br/> borrowers together for mutual growth.</p>
          </div>
          <div className='relative  flex justify-center items-center top-16  w-[38%] h-[50%] '>
            <img src={frontImg} alt="Peer to peer img" className='rounded-xl h-[100%]'/>
          </div>
          </div>
          <div className='flex flex-wrap items-center  justify-center gap-3'>
          <div className='p-2 white-glassmorphism flex items-center justify-center gap-2 text-neutral-100 text-2xl  h-fit w-fit'>
            <h3>Secure Digitised Processes | </h3>
            <h3>Transforming Financial Opportunities | </h3>
            <h3>Earn More with Your Savings</h3>
          </div>
          </div>
          
        </div>
      </div>
      <div className='pb-28 relative h-full w-full gradient-bg-transactions text-neutral-50'>
        <MileStones/>
          <ReasonToJoin/>
         <AppleCardsCarouselDemo/>
         <BackgroundBeamsWithCollisionDemo/>
        </div>
    </>
  );
};

export default Menu;
