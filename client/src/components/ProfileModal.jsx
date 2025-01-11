import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changeProfile } from "../redux/slices/auth";
import { toast } from "react-toastify";

export default function ProfileModal({onAvatarChange}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file,setFile]= useState('');
  


  const dispatch = useDispatch();

  const handleChange=(e)=>{
    setFile(e.target.files[0])
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const formData=new FormData();
      formData.append('file',file);
     const saveChange = await dispatch(changeProfile(formData));
      setFile('')
      if(saveChange?.status==='success'){
       const newAvatar = saveChange?.avatar
       onAvatarChange(newAvatar)
       console.log(newAvatar)
        toast.success(saveChange.message);
        
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  

  return (
    <>
      <Button onPress={onOpen} className=" flex w-full rounded-none items-start justify-start bg-gray-300 px-4 py-2 mt-2 hover:bg-gray-200">Edit Profile</Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <label className="block  font-semibold mb-2">
                    Avatar
                  </label>
                 
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Choose image"
                    onChange={handleChange}
                    className="p-3 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="secondary" onPress={onClose} onClick={handleSubmit}>
                  Submit
                </Button>
              </ModalFooter>

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
