import { Navigate, useRoutes } from "react-router-dom";

import AdminLayout from "../layout/admin";
import UserLayout from "../layout/user";
import AuthLayout from "../layout/auth";

import HomePage from "../pages/auth/Home"
import LoginPage from "../pages/auth/Login";
import SignupPage from "../pages/auth/SignUp"
import VerifyPage from "../pages/auth/Verify"

import Invest from "../pages/dashboard/InvestPage"
import UpdateKYC from "../pages/dashboard/UpdateKYCPage"
import KYC from "../pages/dashboard/KYCPage"
import Loan from "../pages/dashboard/LoanPage"
import Menu from "../pages/dashboard/MenuPage"
//import Payment from "../pages/dashboard/PaymentPage"
import Page404 from "../pages/Page404";
import KYCRequestPage from "../pages/dashboard/KYCRequestPage";
import IncomeBank_Statement from "../pages/dashboard/IncomeBankDocsPage"
import LoanRequestPage from "../pages/dashboard/LoanRequestPage";
import NegotiateLoanPage from "../pages/dashboard/NegotiateLoanPage";
import KycStatusPage from "../pages/dashboard/KycStatusPage"
import KycDetailsPage from "../pages/dashboard/KycDetailsPage";
import NegotiationDetailsPage from "../pages/dashboard/NegotiationDetailPage";
import LoanRepaymentDetailsPage from "../pages/dashboard/LoanRepaymentPage";
import InvestedUserPage from "../pages/dashboard/InvestedUsersPage"
import RepaymentPage from "../pages/dashboard/RepaymentPage"
import RepaymentDetailPage from "../pages/dashboard/RepaymentDetailPage"
import LoanRequestUserPage from "../pages/dashboard/LoanRequestUsersPage"
import LoanDetailPage from "../pages/dashboard/LoanDetailPage"
import NegotiateDetailPage from "../pages/dashboard/NegotiateDetailPage"
import ActiveUserPage from "../pages/dashboard/ActiveUserPage"
import Investor_InvestmentPage from "../pages/dashboard/Investor_InvestmentPage";

export default function Router(){
    return useRoutes([
        {
            path:'/auth',
            element:<AuthLayout/>,
            children:[
               {path:'/auth/home', element:<HomePage/>},
               {path:'/auth/login', element:<LoginPage/>},
               {path:'/auth/signup', element:<SignupPage/>},
               {path:'/auth/verify', element:<VerifyPage/>},
               {path:'/auth/kyc', element:<KYC/>},
               {path:'/auth/documents', element:<IncomeBank_Statement/>},
               {path:'/auth/kycstatus', element:<KycStatusPage/>},
               {path:'/auth/updatekyc',element:<UpdateKYC/>},
            ]
        },
        {
            path:'/admin',
            element:<AdminLayout/>,
            children:[
                {element: <Navigate to="/admin/menu" replace/>,index:true},
                {path:'/admin/menu', element:<Menu/>},
                {path:'kycRequest',element:<KYCRequestPage/>},
                {path:'/admin/kycdetails',element:<KycDetailsPage/>},
                {path:'investor_investment',element:<Investor_InvestmentPage/>},
                {path:'/admin/activeUsers',element:<ActiveUserPage/>},
                {path:'/admin/investedUsers',element:<InvestedUserPage/>},
                {path:'/admin/loanRequestUsers',element:<LoanRequestUserPage/>},
                {path:'/admin/negotiationDetails',element:<NegotiationDetailsPage/>},
                {path:'/admin/loanRepaymentDetails',element:<LoanRepaymentDetailsPage/>},
                
                {path:'404',element:<Page404/>},
                { path: "*", element: <Navigate to="/404" replace /> }
            ]
        },
        {
            path:'/',
            element:<UserLayout/>,
            children:[
                { element: <Navigate to="/menu" replace />, index: true },
                
                {path:'menu',element:<Menu/>},
                {path:'invest',element:<Invest/>},
                {path:'loan',element:<Loan/>},
                {path:'investor_investment',element:<Investor_InvestmentPage/>},
                {path:'repayment',element:<RepaymentPage/>},
                {path:'repayment/:id',element:<RepaymentDetailPage/>},
                {path:'loanRequest',element:<LoanRequestPage/>},
                {path:'loanRequest/:id',element:<LoanDetailPage/>},
                {path:'negotiate',element:<NegotiateLoanPage/>},
                {path:'negotiate/:id',element:<NegotiateDetailPage/>},
                {path:'404',element:<Page404/>},
                { path: "*", element: <Navigate to="/404" replace /> }
            ]
        },
        { path: "*", element: <Navigate to="/404" replace /> },
    ])
}