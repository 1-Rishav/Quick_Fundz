//import { Link as RouterLink } from "react-router-dom";
// sections
import { Stack, Typography, /* Link */ } from "@mui/material";
/* import AuthSocial from "../../sections/auth/AuthSocial";
import Login from "../../sections/auth/LoginForm"; */
import VerifyForm from "../../forms/verifyForm";
 import { useSelector } from "react-redux"; 

// ----------------------------------------------------------------------

export default function VerifyPage() {
   const {email} =useSelector((state)=>state.auth)
 
  return (
    <><div className="gradient-bg-transactions min-h-screen h-full text-neutral-100">
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" className="flex items-center justify-center p-5 h-full w-[80%] font-serif text-base">Please Verify OTP</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="h6" className="flex items-end justify-center w-[75%] h-full">
            Sent to email ({email})
          </Typography>
        </Stack>
      </Stack>
      {/* Form */}
      <VerifyForm />
      </div>
    </>
  );
}
