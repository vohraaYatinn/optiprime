/* eslint-disable */
import React, { useEffect, useState } from 'react'

import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { userFetchDetails, userAmountDetails } from 'src/urls/urls'
import useAxios from 'src/network/useAxios'
import { Alert, Input, Radio } from 'antd'
import { useSelector } from 'react-redux'
import { userDetails } from 'src/redux/reducers/userDetails.reducer'

const UsersAdmin = () => {
  const profile = useSelector(userDetails);

  const options = [
    {
      label: 'Topup',
      value: 'topup',
    },
    {
      label: 'Withdraw',
      value: 'withdraw',
    }
  ];

  // useAxios
  const [userData, userDataError, uesrDataLoading, userDataFetch] = useAxios();
  const [userAmountData, userAmountError, userAmountLoading, userAmountSubmit] = useAxios();


  //use State
  const [visible, setVisible] = useState(false);
  const [value3, setValue3] = useState('topup');



  // Functions

  const onChange3 = ({ target: { value } }) => {
    setValue3(value);
  };
  const fetchDashboardUserData = () => {
    if(profile?.email) userDataFetch(userFetchDetails({ email: profile?.email }));
  };



  const [message, setMessage] = useState({
    showMessage: false,
    isError:"",
    message:""
  });
  useEffect(()=>{
    if(userAmountData?.result == "success"){
      setMessage((prev)=>({...prev,
        message:userAmountData?.message, 
        isError:false, 
        showMessage:true}));
      setVisible(false)
      fetchDashboardUserData()
    }
  },[userAmountData])
  useEffect(() => {
    fetchDashboardUserData();
  }, [profile]);
const [formValue, setFormValue] = useState()
const changeAmountUser = (value, action) => {
  userAmountSubmit(userAmountDetails({...value, action:action}))
}


  return (
    <>
       {message.showMessage && <Alert style={{marginBottom:"1rem"}} message={message?.message} closable type={message?.isError?"error":"success"} onClose={()=>setMessage((prev)=>({...prev, message:"", isError:false, showMessage:false}))
} />}
        <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)} >
        <CModalHeader>
          <CModalTitle>Wallet Action</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <Radio.Group options={options} onChange={onChange3} value={value3} optionType="button" />
        <Input defaultValue="0" style={{marginTop:"1rem"}} 
        onChange={(e)=>
          setFormValue((prev)=>({...prev,
          amount:e.target.value
          }))
          }
        />
      <p>You have selected to <span style={{color:value3=="topup"?"green":"red", fontSize:"1.1rem"}}>{value3.toUpperCase()}</span> the amount.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary"
          onClick={()=>changeAmountUser(formValue, value3)}
          >Submit</CButton>
        </CModalFooter>
      </CModal>

      <CRow>
        <CCol xs>

        <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    {/* <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell> */}
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Company</CTableHeaderCell>
                    <CTableHeaderCell>Total Amount</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Amount Actions</CTableHeaderCell>
                    {/* <CTableHeaderCell>Activity</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {userData && userData?.data?.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      {/* <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell> */}
                      <CTableDataCell>
                        <div>{item.user.full_name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.email}</span>
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                      <div>{item.brand_name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>$ {item.user?.coins_user[0]?.coin || 0}</div>

                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                       <CButton onClick={() => 
                        {
                          setFormValue({
                            userEmail:item.user.email
                          })
                        setVisible(!visible)
                        }
                        } variant='outline'>Wallet</CButton>
                      </CTableDataCell>
                      {/* <CTableDataCell>
                        <div className="small text-medium-emphasis">Last login</div> */}
                        {/* <strong>{item.activity}</strong> */}
                      {/* </CTableDataCell> */}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default UsersAdmin
