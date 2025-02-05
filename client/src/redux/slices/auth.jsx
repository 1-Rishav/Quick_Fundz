import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
// ----------------------------------------------------------------------

const initialState = {
  isLoggedIn: false,
  email: "",
  error: false,
  role: null,
  token: null,
  user_id: null,
  docs_status:false,
  verificationStatus:'pending',
  kycMessage: null,
  loan_status:'processing',
  verified:false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    }, */
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.verificationStatus = action.payload.verificationStatus;
      state.verified = action.payload.verified;
      state.docs_status = action.payload.docs_Status;
      state.user_id = action.payload.user_id;
      state.email = action.payload.email;
      state.kycMessage = action.payload.kycMessage;
      
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = null;
      state.user_id = null;
      state.role = null;
      state.email = "";
      state.verificationStatus=null;
      state.verified = false;
    },
    /* updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    }, */
    verifiedUser(state,action){
      state.isLoggedIn = action.payload.isLoggedIn;
      state.role=action.payload.role;
      state.verificationStatus = action.payload.verificationStatus;
      state.verified=action.payload.verified;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
    /* verifyLoan(state, action){
      state.loan_status=action.payload.loan_status;
    } */
  },
});

// Reducer
export default slice.reducer;

export function LoginUser(formValues) {
  console.log(formValues.email);
  return async (dispatch, getState) => {
    try {
      const response = await axios.post("auth/login", formValues,{withCredentials: true});

      const { token, role, user_id, message, verificationStatus,kycMessage,verified,docs_status} = response.data;
      if(verificationStatus === 'verified' && verified === true && docs_status===true ){
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            role,
            verificationStatus,
            token,
            user_id,
            docs_status,
            verified,
            email: formValues.email,
          })
        );
      }else if(verificationStatus===null && verified===false && docs_status===false){
        dispatch(slice.actions.logIn({
          user_id,
          verificationStatus,
          verified
        }))
        window.location.href='/auth/signup'
      }else if(verificationStatus===null && verified===true && docs_status===false){
        dispatch(
          slice.actions.logIn({
            user_id,
            verificationStatus,
            verified
          })
        )
        window.location.href='/auth/kyc' 
      }else if(verificationStatus==='pending' && verified===true && docs_status===false){
        dispatch(
          slice.actions.logIn({
            user_id,
            verificationStatus,
            verified
          })
        )
        window.location.href='/auth/documents'
      }
      else{
        dispatch(slice.actions.logIn({
          user_id,
          verificationStatus,
          kycMessage
        }))
        window.location.href='/auth/kycStatus'
      }
      

      window.localStorage.setItem("user_id", user_id);
      //window.localStorage.setItem("token", token);
      toast.success(message );

    } catch (error) {
      toast.error(error.response.data.message);
      /* dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
    } finally {
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false })); */
    }
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    window.location.reload();
    dispatch(slice.actions.signOut());
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    let response;
    try {
      response = await axios.post("auth/register", formValues,{withCredentials: true});
      const { user_id, message } = response.data;

      dispatch(slice.actions.updateRegisterEmail({email:formValues.email}))
      window.localStorage.setItem("user_id", user_id);
      //window.localStorage.setItem("token", token);
      toast.success(message);
if (!getState().auth.error) {
        //window.location.href = "/auth/kyc"
        window.location.href = "/auth/verify"
}
    } catch (error) {
      toast.error(error.response.data.message);
      //dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
    } 
      
        /* const {token,role , user_id } = response.data;
      dispatch(
        slice.actions.logIn({
          isLoggedIn:true,
          role,
          token,
          user_id,
          email: formValues.email,
        })
      ) */
      
  };
  
} 

export function VerifyEmail(formValues){
  return async(dispatch,getState)=>{
    try {
     const response = await axios.post("/auth/verifyEmail",{...formValues},{withCredentials:true})

     toast.success(response.data.message);
      if(!getState().auth.error){
        window.location.href = "/auth/kyc"
      }
    } catch (error) {
      toast.error(error.response.data.message);
     
    }
  }
}

export function UserKyc(formValues){
  return async(dispatch,getState)=>{
    try {
     const response =await axios.post("auth/kycEntry",formValues,{withCredentials: true})
      const {message}=response.data;
     toast.success(message );

     if(!getState().auth.error){
      window.location.href = "/auth/documents" 
          }
    } catch (error) {
      toast.error(error.response.data.message)
    }
      
  }
}
export function documents(formValues){
  
  return async(dispatch,getState)=>{
    try {
      const response = await axios.post('auth/incomeDocuments',formValues,{
        headers: { 'Content-Type': 'multipart/form-data' },withCredentials:true
      })
      const {message}=response.data;
      toast.success(message)
     
      if(!getState().auth.error){
        window.location.href = "/auth/kycstatus" 
            }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
}

 export function verifiedKyc(formValues){
  return async(dispatch)=>{
    try {
      const response= await axios.post('auth/verifiedKyc',formValues ,{withCredentials: true})
      
      const {role,message,verificationStatus,verified}=response.data;
      dispatch(
        slice.actions.verifiedUser({
          isLoggedIn:true,
          role,
          verificationStatus,
          verified
        })
        
      )
      
toast.success(message);
    } catch (error) {
      toast.error(error.response.data.message)
    }
  } 
} 

export function showKycRequest(){
  return async ()=>{
    try {
      const response = await axios.get('admin/showRequest')
      toast.success(response.data.message)

      return response.data;
    } catch (error) {
toast.error(error.response.data.message)    }
  }
}

export function confirmOrRejectRequest(formValues){
  return async()=>{
    try {
      const response = await axios.post('admin/confirmOrRejectUser',formValues);
      toast.success(response.data.message)
    } catch (error) {
toast.error(error.response.data.message)    }
  }
}

export function rejectedkyc(formValues){
  return async(dispatch,getState)=>{
    try {
      const response = await axios.post('auth/updatekyc',formValues);
      const {message,verificationStatus}=response.data;
      toast.success(message);
      dispatch(
        slice.actions.verifiedUser({
          verificationStatus
        })
      )
      if(!getState().auth.error){
       window.location.href = "/auth/kycstatus" 
           }
    } catch (error) {
      toast.error(error.response.data.message)

    }
  }
}

export function investmentEntry(formValues){
  return async()=>{
    try {
      const response = await axios.post(
        "investments/invest",formValues,{withCredentials:true}
      );
      toast.success(response.data.message);
    } catch (error) {
toast.error(error.response.data.message)    }
  }
}

export function allInvestments(){
  return async()=>{
    try {
      const response = await axios.get('investments/moneyLender',{withCredentials:true})
      if(response.data.liveLoan.length>0){
        toast.success(response.data.message)
      }
      return response.data;
    } catch (error) {
toast.error(error.response.data.message)    }
  }
}

export function loanAccept(formValues){
  return async()=>{
    try {
      const response  = await axios.post('loanRequest/loanAccepted',formValues,{withCredentials:true});
      toast.success(response.data.message)
    } catch (error) {
toast.error(error.response.data.message)     }
  }
}

export function loanRequest(formValues){
  return async()=>{
    try {
      const response = await axios.post('loanRequest/loan',formValues,{withCredentials:true})
      toast.success(response.data.message)

    } catch (error) {
      toast.error(error.response.data.message)     }
  }
}

export function requestInvestor(formValues){
  return async()=>{
     
      try {
        const response = await axios.post('loanRequest/requestInvestor',formValues,{withCredentials:true})        
        toast.success(response.data.message)
        return response.data;
        
      } catch (error) {
        toast.error(error.response.data.message) 
      }
    
  }
}

export function rejectedLoan(formValues){
  return async()=>{
    try {
      const response = await axios.post('loanRequest/rejectLoan',formValues,{withCredentials:true})
      toast.success(response.data.message)

    } catch (error) {
      toast.error(error.response.data.message) 

    }
  }
}

export function approvedLoan(formValues){
  return async()=>{
    try {
      const response = await axios.post('loanRequest/acceptLoan',formValues,{withCredentials:true})
      toast.success(response.data.message)

    } catch (error) {
      toast.error(error.response.data.message) 

    }
  }
}

export function investorNegotiate(formValues){
  return async()=>{
    try {
      const response = await axios.post('loanRequest/lastNegotiate',formValues,{withCredirectials:true})
      toast.success(response.data.message)

    } catch (error) {
      toast.error(error.response.data.message) 

    }
  }
}

export function negotiateValue(){
  return async()=>{
    try {
      const response = await axios.get('negotiateRequest/allNegotiateAmount',{withCredentials:true})
      toast.success(response.data.message)
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message) 
    }
  }
}

export function negotiationApprove(formValues){
  return async()=>{
    try {
      const response = await axios.post('negotiateRequest/approveNegotiation',formValues,{withCredentials:true})
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message) 
    }
  }
}

export function rejectNegotiation(formValues){
  return async()=>{
    try {
      const response = await axios.post('negotiateRequest/negotiationReject',formValues,{withCredentials:true})
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message) 
    }
  }
}

export function kycUser(){
  return async()=>{
    try {
      const response = await axios.get('admin/kycUsers');
      
      return response.data;
    } catch (error) {
    console.log(error)    }
  }
}

export function adminUpdateKyc_user(formValues){
  console.log(formValues);
  return async()=>{
try {
    const response = await axios.post('admin/adminUpdateKycUser',formValues,{withCredentials:true})
    toast.success(response.data.message);
} catch (error) {
    toast.error(error.response.data.message)
}    
  }
}

export function activeUser(){
  return async()=>{
    try {
      const response = await axios.get('admin/users');

      return response.data;

    } catch (error) {
console.log(error)    }
  }
}

export function deleteCurrentUser(formValues){
  return async()=>{
    try {
      const response = await axios.get(`admin/deleteUser/${formValues}`)
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

}

export function adminUpdateCurrent_user(formValues){
  return async()=>{
    try {
      const response = await axios.post('admin/UpdateCurrent_user', formValues,{withCredentials:true});
      toast.success(response.data.message);

    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
}

export function adminMessage(){
  return async()=>{
    try {
      const response = await axios.get('admin/message',{withCredentials:true})
      return response.data;
    } catch (error) {
console.error(error.response.data.message);
    }
  }
}

/* export function deleteMessage(){
  return async()=>{
    try {
      const response = await axios.get('admin/messageDelete',{withCredentials:true})
    } catch (error) {
      console.log(error)
    }
  }
} */

  export function investedUsers(){
    return async()=>{
      try {
        const response = await axios.get('admin/allInvestment',{withCredentials:true})
        return response.data;
      } catch (error) {
        console.log(error)
      }
    }
  }

  export function loanRequestUsers(){
    return async()=>{
      try {
        const response = await axios.get('admin/allLoanRequest',{withCredentials:true});
        return response.data;
      } catch (error) {
console.log(error)      }
    }
  }

  export function updateLoanRequestUser(formValues){
return async()=>{
  try {
    const response = await axios.post('admin/updateLoan_details',formValues);
    toast.success(response.data.message);

  } catch (error) {
    toast.error(error.response.data.message);
  }
}
  }

  export function updateInvestedUser(formValues){
    return async()=>{
      try {
        const response = await axios.post('admin/updateInvestor_details',formValues)
        toast.success(response.data.message);

      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function createOrder(formValues){
    
    return async()=>{
      try {
        const response = await axios.post('paymentRequest/orderCreation',formValues,{withCredentials:true});
        toast.success(response.data.message);
        return response.data;
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function payingMoney(formValues) {
    return async()=>{
      try {
        const response = await axios.post('paymentRequest/payingMoney',formValues,{withCredentials:true});
        toast.success(response.data.message);
        return response.data
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function moneyPaid(formValues){
    return async()=>{
      try {
        const response = await axios.post('loanRequest/paidStatus',formValues,{withCredentials:true})
        toast.success(response.data.message)
        return response.data;
      } catch (error) {
        toast.error(error.response.data.message) 
      }
    }
  }

  export function repayLoan(){
    return async()=>{
try {
      const response = await axios.get('loanRequest/repayStatus',{withCredentials:true});
      toast.success(response.data.message)

      return response.data;
} catch (error) {
  toast.error(error.response.data.message) 

}      
    }
  }

  export function moneyRepayment(formValues){
    return async()=>{
      try {
        const response = await axios.post('loanRequest/moneyRepay',formValues,{withCredentials:true});
        toast.success(response.data.message)
        return response.data;
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
  }

  export function allNegotiateData(){
    return async()=>{
      try {
        const response = await axios.get('admin/allNegotiateUser',{withCredentials:true})
        return response.data;
      } catch (error) {
console.log(error);      }
    }
  }

  export function updateNegotiationUser(formValues){
    return async()=>{
      try {
        const response = await axios.post('admin/updateNegotiation_details',formValues)
        toast.success(response.data.message);

      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function allRepaymentData(){
    return async()=>{
      try {
        const response = await axios.get('admin/allRepaymentUser',{withCredentials:true})

        return response?.data;
      } catch (error) {
        console.log(error);      }
    }
  }

  export function updateRepaymentData(formValues){
    return async()=>{
      try {
        const response = await axios.post('admin/updateRepayment_details',formValues)
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function deleteUser(formValues){
    return async()=>{
      try {
        const response = await axios.post('admin/deleteUser',formValues,{withCredentials:true})
        toast.success(response.data.message);

      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function loanPreRequest(formValues){
    return async()=>{
      try {
        const response = await axios.post('loanRequest/preRequest',formValues,{withCredentials:true})
        toast.success(response.data.message);

      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function changeProfile(formValues){
    return async()=>{
      try {
        const response = await axios.post('auth/profileImage',formValues,{headers: { 'Content-Type': 'multipart/form-data' },withCredentials:true})
        toast.success(response.data.message);
        return response.data;
        
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function userAvatar(){
    return async()=>{
      try {
        const response = await axios.get('auth/userAvatar',{withCredentials:true})
        return response.data
      } catch (error) {
        console.log(error)
      }
    }
  }

  export function screenRequestLoan(formValues){
    return async()=>{
      
        try {
          const response = await axios.post('loanRequest/smallScreenRequest',formValues,{withCredentials:true})
          toast.success(response.data.message);
          return response.data;
        } catch (error) {
          toast.error(error.response.data.message);
        }
      
    }
  }

  export function screenNegotiate(formValues){
    return async()=>{
      try {
        const response = await axios.post('negotiateRequest/smallNegotiate',formValues,{withCredentials:true})
        toast.success(response.data.message)
        return response.data;
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  export function screenRepayment (formValues){
    return async()=>{
      try {
        const response = await axios.post('loanRequest/smallRepayment',formValues,{withCredentials:true})
        toast.success(response.data.message);
        return response.data
      } catch (error) {
        toast.error(error.response.data.message);

      }
    }
  }

  export function allInvest(){
    return async()=>{
      try {
        const response = await axios.get('investments/lendAmount',{withCredentials:true})
        toast.success(response.data.message)

      return response.data;
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
  }