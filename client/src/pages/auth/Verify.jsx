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
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Please Verify OTP</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">
            Sent to email ({email})
          </Typography>
        </Stack>
      </Stack>
      {/* Form */}
      <VerifyForm />
    </>
  );
}
