/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react'
import { WhatsAppOutlined } from '@ant-design/icons';

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormInput,
  CFormRange,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CProgress,
  CRow,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
  CWidgetStatsC,
  CWidgetStatsF,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import axios from 'axios';
import opti from "../invoices/optiprime.jpeg"

import CIcon from '@coreui/icons-react'
import {
  cilArrowCircleTop,
  cilArrowCircleBottom,
  cilHistory,
  cilPlus
} from '@coreui/icons'

import { useDispatch, useSelector } from 'react-redux'
import { updateUserCoins, userDetails } from 'src/redux/reducers/userDetails.reducer'
import { paymentCustomerDashboard, paymentCustomerWithdraw, paymentCustomerRedeem } from 'src/urls/urls'
import useAxios from 'src/network/useAxios';
import { Alert, Button, Modal } from 'antd';
import { useParams } from 'react-router-dom';
import { useRouter } from 'src/hooks/use-router';
import convertToPDF from 'src/components/convertToPdf';
import moment from 'moment';

const AmountCustomer = () => {
  const profile = useSelector(userDetails);
  const router = useRouter();

  const [message, setMessage] = useState({
    showMessage: false,
    isError: '',
    message: '',
  });
  const { top } = useParams();
  const {amount} = useParams();
  const [navActions, setNavActions] = useState('topup')

  const [moneyActionForm, setMoneyActionForm] = useState({
    amount: 7000,
    coupon:"",
    action: navActions,
    email:profile?.email,
    bankAccount:"",
    pdf:""
  })
  useEffect(()=>{
    if(top && !amount){
      handleOpenModalSecond()
    }
    if(amount){
      setMoneyActionForm((prev)=>({...prev, coupon:amount, email:profile?.email}))
      const money = {...moneyActionForm, coupon:amount}
      initiatePayment(money)
    }
    
  },[top])


  // useAxios
  const [customerDashResponse, customerDashError, customerDashLoading, customerDashFetch] = useAxios();

  const [paymentCheck, errorpaymentCheck, loadingpaymentCheck, fetchPaymentCheck] = useAxios();
  const [customerWithdrawResponse, customerWithdrawError, customerWithdrawLoading, customerWithdrawFetch] = useAxios();
  const [redeemResponse, redeemError, redeemLoading, redeemFetch] = useAxios();

  //use State

  const [paymentId, setPaymentId] = useState('');
  const dispatch = useDispatch();
  const [dynamicData, setDynamicData] = useState('Dynamic content here');
  const handleConvertToPDF = (response) => {
    const htmlContent = `<div class="card invoice-preview-card">
    <div class="card-body">
      <div class="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column">
        <div class="mb-xl-0 pb-3">
        <div class="d-flex svg-illustration align-items-center gap-2 mb-4">
        <span class="app-brand-logo demo" />
          <img src=${opti} alt="Materio Logo" style="width: 20rem;" />
        </span>
      </div>
          <p class="mb-1">44, Chung Hau Street,</p>
          <p class="mb-1">Hongkong, New territories,</p>
          <p class="mb-0">Tseung Kwan O, HK (HKG)</p>
        </div>
        <div class="mt-4">
          <h4 class="fw-medium text-capitalize pb-1 text-nowrap">INVOICE</h4>
          <h6>#${response?.file_name}</h6>
          <div class="mb-1">
            <span>Date Issues:</span>
            <span>${moment(response?.created_at).format('MMMM DD, YYYY  -  HH:mm:ss')}</span>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-0">
    <div class="card-body">
      <div class="d-flex justify-content-between flex-wrap">
        <div class="my-3 me-3">
          <h6>Invoice To:</h6>
          <p class="mb-1">${profile?.full_name}</p>
          <p class="mb-1">${profile?.user[0]?.company_address}</p>
          <p class="mb-1">${profile?.phone}</p>
        </div>

      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless m-0">
        <thead class="border-top">
          <tr>
            <th>Item</th>
            <th>Description</th>
        
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-nowrap text-heading">TOPUP AMOUNT</td>
            <td class="text-nowrap">Amount Has been Credited to the account</td>
  

            <td>$${response?.amount}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr class="my-0">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 mb-md-0 mb-3">
          <div>
            <p class="mb-2">
            </p>
          
          </div>
        </div>
        <div class="col-md-6 d-flex justify-content-md-end mt-2">
          <div class="invoice-calculations">
            <div class="d-flex justify-content-between mb-2">
              <span class="w-px-100">Discount:</span>
              <h6 class="mb-0 pt-1">$00.00</h6>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="w-px-100">Tax:</span>
              <h6 class="mb-0 pt-1">$00.00</h6>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
              <span class="w-px-100">Total:</span>
              <h6 class="mb-0 pt-1">$${response?.amount}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-0">

    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <span class="fw-medium">Note:</span>
          <span>It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance
            projects. Thank You!</span>
        </div>
      </div>
    </div>
  </div>`
    convertToPDF(htmlContent, 'Invoice.pdf');
    handleOpenModal()

  }

  // Functions
  const initiatePayment = async (money = false) => {
    if (money){
      redeemFetch(paymentCustomerRedeem(money))
    }
    else{
      redeemFetch(paymentCustomerRedeem(moneyActionForm))
    }

  };
  const customerWithdrawFunc = () => {
    customerWithdrawFetch(paymentCustomerWithdraw({email: profile?.email, amount:moneyActionForm.amount, bankAcc:moneyActionForm?.bankAcc}))
  }
  const customerDashFunc = () => {
    customerDashFetch(paymentCustomerDashboard({email: profile?.email}))
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleSecond, setModalVisibleSecond] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    message:"",
    invoice:false
  });

  useEffect(()=>{
    if(modalVisible || modalVisibleSecond){
      var toolbarElement = document.querySelector('.header.header-sticky');
      if (toolbarElement) {
        toolbarElement.style.zIndex = 0;
      }
    }
    else{
      var toolbarElement = document.querySelector('.header.header-sticky');
      if (toolbarElement) {
        toolbarElement.style.zIndex = 2000;
      }
    }
  },[modalVisible, modalVisibleSecond])
  useEffect(()=>{
    customerDashFunc()
  },[])
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleOpenModalSecond = () => {
    setModalVisibleSecond(true);
  };

  const handleCloseModalSecond = () => {
    setModalVisibleSecond(false);
  };

  // UseEffect
  useEffect(() => {
    if (redeemResponse?.result == 'success') {
      setModalMessage((prev)=>({...prev, message: "The token has been successfully redeemed. Kindly refresh the page to view the updated amount.", invoice: true}))
      handleConvertToPDF(redeemResponse)


    }
    else if(redeemResponse?.result == 'failure'){
      setModalMessage((prev)=>({...prev, message:"Either the coupon code you entered was invalid or Expired, Please contact your administrator", invoice:false}))
      handleOpenModal()

    }
  }, [redeemResponse]);
  useEffect(() => {
    if (customerWithdrawResponse?.result == 'success') {
      setMoneyActionForm((prev)=>({...prev,amount:""}))
      customerDashFunc();
      setMessage((prev) => ({
        ...prev,
        showMessage: true,
        isError: false,
        message: customerWithdrawResponse?.message,
      }));
      dispatch(updateUserCoins(customerWithdrawResponse?.updated_coins));

    }
  }, [customerWithdrawResponse]);

  return (
    <>
  
  <Modal
        title={modalMessage?.invoice ? 'Payment Successful' : "Issue with the token"}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Return
          </Button>,
          modalMessage?.invoice ?
                <Button key="back"
                type="primary" style={{backgroundColor:"green", color:"white"}} 
                onClick={()=>handleConvertToPDF(redeemResponse)}>
                Download Invoice
              </Button>
              :
              <Button
              key="submit"
              type="primary"
              style={{ backgroundColor: "green", color: "white" }}
              onClick={() => {
                const message = `
OptiPrime,
I trust this message finds you well. I would like to bring to your attention the issue with the token mentioned below:

Token: ${moneyActionForm?.coupon}
is having some issue, kindly check through it please.

Best regards,
testing1 testing2`;
            
                const encodedMessage = encodeURIComponent(message);
                const whatsappLink = `https://wa.me/+31647694329?text=${encodedMessage}`;
                
                window.open(whatsappLink, "_blank");
              }}
            >
              Whatsapp Us
            </Button>

       ,
        ]}
        width={800} // Adjust width as needed
      >
        {modalMessage?.message}
      </Modal>
  <>
    <CModal
      backdrop="static"
      className='static-modal-down'
      visible={modalVisibleSecond}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">
         <h3> Alert </h3>
          </CModalTitle>
      </CModalHeader>
      <CModalBody>
      To Access our premium features, Your account need a Top-Up, Please Contact our account manager for more details.
      </CModalBody>
      <CModalFooter>
<CButton color=''
onClick={()=> router.push('../dashboard')}
>
Return

</CButton>
        <CButton color="success" style={{color:"white"}}
        onClick={()=>{
          const message = encodeURIComponent(`
Hi,
I would like to bring to your attention that I have recently joined your portal and I am willing to know about doing a product quotation and the process of working with OptiPrime.

Best Regards,
${profile?.full_name

}`)

              window.open(`${"https://wa.me/+31647694329?text="}${message}`, "_blank");
        }}
        >      <WhatsAppOutlined /> &nbsp;
Whatsapp us</CButton>
      </CModalFooter>
    </CModal>
  </>
       
      {message.showMessage && (
        <div style={{ marginBottom: '1rem' }}>
          {' '}
          <Alert
            message={message?.message}
            closable
            type={message?.isError ? 'error' : 'success'}
            onClose={() =>
              setMessage((prev) => ({ ...prev, message: '', isError: false, showMessage: false }))
            }
          />
        </div>
      )}
<CRow>
    
<CCol xs={12} sm={6} lg={9}>
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink
            active={navActions == 'topup' ? true : false}
            onClick={() => setNavActions('topup')}
            style={{ cursor: 'pointer' }}
          >  
            <CIcon icon={cilArrowCircleTop} className="me-2" />
            Top up wallet
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={navActions == 'withdraw' ? true : false}
            onClick={() => setNavActions('withdraw')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilArrowCircleBottom} className="me-2" />
            Withdraw
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent className="rounded-bottom">
        <CTabPane className="p-3 preview tab-pane-mobile" visible >
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>
              Current Balance: <span style={{ fontSize: '1.8rem' }}>${profile.user_coins.length > 0 ? profile.user_coins[0]?.coin : "N/A"}</span>
            </h2>

            {navActions == 'withdraw' && <p style={{color:"red"}}>Withdrawn amount will be settled in your account within 12 buisness days</p>}

          </div>
          {navActions == 'topup' &&
          <>
          <div style={{ width: '80%' , marginTop:"1.5rem"}} className='red-mobile-input'>
            <CInputGroup>
              <CFormInput
                aria-label="Dollar amount (with dot and two decimal places)"
                value={moneyActionForm?.coupon}
                placeholder='Enter your link to redeem'
                className='red-amount-inp'
                onChange={(e) => {
                  setMoneyActionForm((prev) => ({ ...prev, coupon: e.target.value }))
                }}
              />
               {navActions == 'topup' &&
            <CButton
            onClick={()=>navActions == 'withdraw' ? customerWithdrawFunc(): initiatePayment() }
            > {navActions == 'withdraw' ? "Withdraw Amount" : "Redeem Link"}</CButton>}
              <p style={{color:"#a0550c", marginTop:"1rem"}}>
              The funds you deposit can be effortlessly withdrawn, and any withdrawn amount will be transferred to your bank account within 12 business days.
              </p>
            </CInputGroup>
        
            </div>
          <div style={{ width: '70%' }}>
            <p style={{ textAlign: 'center' }}>Or</p>
          </div>
          <div >
            <h4 style={{marginTop:"1rem", marginBottom:"1rem"}}>Choose from Our Existing Topup Plans</h4>
            <CRow>
              <CCol xs={12} sm={12} lg={12} className='pad-mobile-amount'>
                <CWidgetStatsB
                style={{cursor:"pointer"}}
                onClick={()=>{
                  const message = encodeURIComponent(`
Hi,

I wanted to know more about the service (top-up credit) plans for me, I would like to hear from you soon.
    
Best regards,
${profile?.full_name}
`)
window.open(`${"https://wa.me/+31647694329?text="}${message}`, "_blank");
}}
                  className={`mb-4 hover-point-price`}
                  progress={{ color: 'success', value: 100 }}
                  text="We will provide the best suitable for you"
                  title="Talk to our account manager for the best plans suitable for you"
                  value="Contact Us"
                />
              </CCol>
           
            </CRow>
          </div>
          </>
          }
          {navActions == 'withdraw' &&
          <>
          
          <div style={{ width: '80%' , marginTop:"2rem"}} className='with-mobile-tab'>
            <CInputGroup>
              <CInputGroupText>$</CInputGroupText>

              <CFormInput
                aria-label="Dollar amount (with dot and two decimal places)"
                value={moneyActionForm?.amount}
                onChange={(e) => {
                  if(e.target.value >= 0){
                  setMoneyActionForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                }}
              />
              <CInputGroupText>0.00</CInputGroupText>
            </CInputGroup>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              defaultValue="7"
              id="customRange3"
              style={{ width: '100%', marginTop: '1rem' }}
              onChange={(e) => {
                setMoneyActionForm((prev) => ({ ...prev, amount: e.target.value * 1000 }))
              }}
            />          </div>
        
          <div >
            <h4 style={{marginTop:"3rem", marginBottom:"1rem"}}>Update your Bank Account Details</h4>
            <p style={{marginTop:"-1rem"}}>Please enter the details of your bank account in which you want 
            your Balance to be Credited.
            </p>
            <CRow>
            <CInputGroup style={{height:"9rem", marginBottom:"1rem"}}>
                <CInputGroupText className='mobile-bank-amount'>Your Bank Account Details</CInputGroupText>
                <CFormTextarea aria-label="With textarea"
                onChange={(e)=>setMoneyActionForm((prev) => ({ ...prev, bankAcc: e.target.value }))
              }
                placeholder="For example&#10;Name: John Smith&#10;Account Number: 233432-234-233-23&#10;Bank Name: Abc Bank&#10;Ifsc Code: KKPK32432&#10;
                "
                ></CFormTextarea>
              </CInputGroup>
            </CRow>
          </div>
          </>
          }
       
         
          <div>
          {navActions == 'withdraw' &&
            <CButton
            onClick={()=>navActions == 'withdraw' ? customerWithdrawFunc(): initiatePayment() }
            disabled={profile.user_coins[0]?.coin < moneyActionForm.amount}

            > {navActions == 'withdraw' ? "Withdraw Amount" : "Topup Amount"}</CButton>}
          </div>
        </CTabPane>
      </CTabContent>
</CCol>
<CCol xs={12} sm={6} lg={3} style={{marginTop:"7rem"}}>
  <CRow>
  <CWidgetStatsF
        className="mb-3"
        color="primary"
        icon={<CIcon icon={cilHistory} height={24} />}
        padding={false}
        title="Last Transaction"
        value={`$ ${customerDashResponse?.data?.insights?.last_transaction || "N/A"}`}/>
  </CRow>
  <CRow>
  <CWidgetStatsF
        className="mb-3"
        color="primary"
        icon={<CIcon icon={cilPlus} height={24} />}
        padding={false}
        title="Last Topup"
        value={`$ ${customerDashResponse?.data?.insights?.last_topup || "N/A"}`}/>
  </CRow>
  <CRow>
  <CWidgetStatsF
        className="mb-3"
        color="primary"
        icon={<CIcon icon={cilArrowCircleBottom} height={24} />}
        padding={false}
        title="Last Withdraw"
        value={`$ ${customerDashResponse?.data?.insights?.last_withdraw || "N/A"}`}/>
  </CRow>

</CCol>



      </CRow>
    </>
  )
}

export default AmountCustomer
