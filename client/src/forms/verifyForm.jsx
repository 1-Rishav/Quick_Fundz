//import { useState } from "react";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Stack, Button } from "@mui/material";
// components
import RHFCodes from "../components/hook_forms/RHFCodes";
import FormProvider from "../components/hook_forms/FormProvider";
import { VerifyEmail } from "../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";


// ----------------------------------------------------------------------

export default function VerifyForm() {
  const dispatch=useDispatch();
  const {email} = useSelector((state)=>state.auth)
  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required("Code is required"),
    code2: Yup.string().required("Code is required"),
    code3: Yup.string().required("Code is required"),
    code4: Yup.string().required("Code is required"),
    code5: Yup.string().required("Code is required"),
    code6: Yup.string().required("Code is required"),
  });

  const defaultValues = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    //formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      //   Send API Request
       dispatch(
        VerifyEmail({
          email,
          otp: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
        })
      ); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={5} className="flex items-center justify-center w-full h-full text text-neutral-100">
        <RHFCodes
          keyName="code"
          inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
        />

        <Button
          // fullWidth
          // size="large"
           type="submit"
          // variant="contained"
          sx={{
            mt: 5,
            bgcolor: "text.secondary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
            "&:hover": {
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
            },
          }}
          className=" text-center w-[25%]"
        >
          Verify
        </Button>
      </Stack>
    </FormProvider>
  );
}
