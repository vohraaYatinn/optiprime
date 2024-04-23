/* eslint-disable */
import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilMediaPlay,
  cilCode,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { adminWalletDetails, changeRequestStatus } from 'src/urls/urls'
import useAxios from 'src/network/useAxios'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { userDetails } from 'src/redux/reducers/userDetails.reducer'
import { Alert, Button } from 'antd'

const InvoiceAdmin = () => {

//useaxios
const [topResponse, topError, topLoading, topFetch] = useAxios();
const [withdrawResponse, withdrawError, withdrawLoading, withdrawFetch] = useAxios();
const [changeWithDrawStatus, changeWithDrawStatusError, changeWithDrawStatusLoading, changeWithDrawStatusFetch] = useAxios();

const profile = useSelector(userDetails);

const [message, setMessage] = useState({
  showMessage: false,
  isError:"",
  message:""
});
const fetchDetails = (action) => {
  if(action == "topup"){
    topFetch(adminWalletDetails({
      email:profile?.email,
      action:"topup"
    }
    ))
  }
  else{
    withdrawFetch(adminWalletDetails({
      email:profile?.email,
      action:"withdraw"
    }
    ))

  }
}
const [tabSelected, setTabSelected] = useState("topup")

  // useAxios
  const [topupAmountData, setTopupAmount] = useState([])
  const [withdrawAmountData, setWithdrawAmount] = useState([])


useEffect(()=>{
  fetchDetails(tabSelected)
},[tabSelected])

useEffect(()=>{
  if(topResponse?.result == "success" ){
    setTopupAmount(topResponse?.data)
  }
},[topResponse])
useEffect(()=>{
  if(withdrawResponse?.result == "success" ){
    setWithdrawAmount(withdrawResponse?.data)

  }
},[withdrawResponse])
useEffect(()=>{
  if(changeWithDrawStatus?.result == "success" ){
    setMessage((prev)=>({...prev,
      message:changeWithDrawStatus?.message, 
      isError:false, 
      showMessage:true}));
    withdrawFetch(adminWalletDetails({
      email:profile?.email,
      action:"withdraw"
    }))
  }
},[changeWithDrawStatus])


  return (
    <>
   {message.showMessage && <Alert style={{marginBottom:"1rem"}} message={message?.message} closable type={message?.isError?"error":"success"} onClose={()=>setMessage((prev)=>({...prev, message:"", isError:false, showMessage:false}))
} />}
      <CRow>
      <CCol xs={12} sm={6} lg={9} style={{marginBottom:"2rem"}}>
      <CNav variant="tabs" >
        <CNavItem>
          <CNavLink 
            active={tabSelected == 'topup' ? true : false}
            onClick={() => setTabSelected('topup')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilMediaPlay} className="me-2" />
            Top up wallet
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={tabSelected == 'withdraw' ? true : false}
            onClick={() => setTabSelected('withdraw')}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilCode} className="me-2" />
            Withdraw
          </CNavLink>
        </CNavItem>
      </CNav>

</CCol>
        <CCol xs>

        <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Payment Id</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Created at</CTableHeaderCell>
                    {tabSelected == "withdraw" && 
                    <>
                    <CTableHeaderCell>Bank Account</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                    </>
                    }
                  </CTableRow>
                </CTableHead>
                <CTableBody>

             {
                  tabSelected == "topup"?
                  topupAmountData.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item?.user.full_name}</div>
                        <div className="small text-medium-emphasis">
                          {item?.user.email}
                        </div>
                      </CTableDataCell>
            
                      <CTableDataCell>
                      <strong>{item?.payment_id}</strong>
                       
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>$ {item.amount}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                     <div>{item.created_at}</div>
                      </CTableDataCell>


                    </CTableRow>
                  )):
                  withdrawAmountData.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item?.user.full_name}</div>
                        <div className="small text-medium-emphasis">
                          {item?.user.email}
                        </div>
                      </CTableDataCell>
            
                      <CTableDataCell>
                      <strong>{item?.payment_id}</strong>
                       
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>$ {item.amount}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                     <div>{item.created_at}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                     <div>{item.bank_account}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                     <div>{item.status}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      {item.status == "pending" &&
                      <div style={{display:"flex", gap:"0.5rem", flexDirection:"column"}}>
                    <Button type="primary" 
                    onClick={()=>changeWithDrawStatusFetch(changeRequestStatus({id:item.id}))}
                    >Completed</Button>
                    <Button type="primary" style={{backgroundColor:"green"}}
                    onClick={()=>window.open(`https://wa.me/${item?.user.phone}`)}
                    >Whatsapp</Button>

                    </div>
                  }
                      </CTableDataCell>

                    </CTableRow>
                  ))
                  } 
                </CTableBody>
              </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default InvoiceAdmin
