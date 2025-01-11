import React,{useState,useEffect} from 'react'
import {Avatar} from "@nextui-org/avatar";
import { userAvatar } from '../redux/slices/auth';
import { useDispatch } from 'react-redux';


function UserProfile({handleOpen,avatarUrl}) {
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();
    useEffect(()=>{
      const newAvatar = async()=>{
       const image = await dispatch(userAvatar());
       setAvatar(image.avatar)
       
      }
      
      newAvatar();
    },[dispatch])

    
  return ( 
    <div className="flex gap-3 items-center ">
      <Avatar src={avatarUrl ||avatar} className='avatarfit ' onClick={handleOpen} />
      {/* <Avatar name="Junior" /> */}
      
       
    </div>
  )
}

export default UserProfile