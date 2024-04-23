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
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CRow,

} from '@coreui/react'
import { test_url } from 'src/config/environment';

import { Alert, Button, Drawer, Input, Radio, Space } from 'antd'
import ReactImg from 'src/assets/images/react.jpg'

import { userDetails } from 'src/redux/reducers/userDetails.reducer'
import { productStatusAdmin, productFetchProductsAdmin } from 'src/urls/urls'
import { useSelector } from 'react-redux'
import useAxios from 'src/network/useAxios'
import { useRouter } from 'src/hooks/use-router'

const ProductsAdmin = () => {
  const profile = useSelector(userDetails);
  const [modalVisible, setModalVisible] = useState(false);

  //use axios
  const [productsResponse, productsError, productsLoading, fetchProducts] = useAxios();
  const [productPrice, productError, productLoading, submitProductPrice] = useAxios();


  //useState
  const [open, setOpen] = useState(false)
  const [productsData, setProductsData] = useState([])
  const [cartOrders, setCartOrders] = useState([]);
  const router = useRouter();
  const [form, setForm] = useState({})

  //function
  const showDrawer = () => {
    setModalVisible(true)
  }
  const onClose = () => {
    setModalVisible(false)
  }
  const fetchCustomerOrders = () => {
    fetchProducts(productFetchProductsAdmin({ email:profile?.email }));
  };
  const submitPrice = () =>{
    submitProductPrice(productStatusAdmin(form))
  }
  const [message, setMessage] = useState({
    showMessage: false,
    isError:"",
    message:""
  });
  
  // const placeCart = (id, action) => {
  //   placeCartResponse(adminOrderActions({ orderId:id, status: action}));
  // };

  //useEffect

  useEffect(()=>{
    if(profile?.email){
      fetchCustomerOrders()
    }
  },[profile])
  useEffect(()=>{
    if(productsResponse?.result == "success" && productsResponse?.data){
      setProductsData(productsResponse?.data)
    }
    },[productsResponse])
  useEffect(()=>{
    if(productPrice?.result == "success" ){
      fetchCustomerOrders()
      onClose()
      setMessage((prev)=>({...prev,
         message:productPrice?.message, 
         isError:false, 
         showMessage:true}));

    
    }
    },[productPrice])


  return (
    <>
     {message.showMessage && <Alert message={message?.message} closable type={message?.isError?"error":"success"} onClose={()=>setMessage((prev)=>({...prev, message:"", isError:false, showMessage:false}))
} />}
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader>Products Insights</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={12} xl={12}>
                <CRow>
                  <CCol sm={6}>
                    <div className="border-start border-start-4 border-start-info py-1 px-3">
                      <div className="text-medium-emphasis small">Products Approved</div>
                      <div className="fs-5 fw-semibold">{productsResponse?.insights?.approved}</div>
                    </div>
                  </CCol>
                  <CCol sm={6}>
                    <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                      <div className="text-medium-emphasis small">Products Pending</div>
                      <div className="fs-5 fw-semibold">{productsResponse?.insights?.pending}</div>
                    </div>
                  </CCol>
                </CRow>
              </CCol>

              {/* <CCol xs={12} md={6} xl={6}>
                <CRow>
                  <CCol sm={6}>
                    <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                      <div className="text-medium-emphasis small">Pageviews</div>
                      <div className="fs-5 fw-semibold">78,623</div>
                    </div>
                  </CCol>
                  <CCol sm={6}>
                    <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                      <div className="text-medium-emphasis small">Organic</div>
                      <div className="fs-5 fw-semibold">49,123</div>
                    </div>
                  </CCol>
                </CRow>
              </CCol> */}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CRow>
      <CModal
      backdrop="static"
      className='static-modal-down'
      visible={modalVisible}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">
         <h3> Add Price </h3>
          </CModalTitle>
      </CModalHeader>
      <CModalBody style={{display:"flex", alignItems:"center"}}>
             <span>$&nbsp;</span> <Input onChange={(e)=>{
                            setForm((prev)=>({...prev, 
                              price : e.target.value
                            }))
             }}/>
      </CModalBody>
      <CModalFooter>
<CButton color=''
onClick={()=> onClose()}
>
Return

</CButton>
<CButton color='primary'
onClick={()=>submitPrice()}
>
Submit

</CButton>

      </CModalFooter>
    </CModal>
{productsData.map((product) => (
           <CCol xs={12} sm={6} lg={3} key={product.id}>
           <CCard style={{ width: '18rem', marginTop: '1rem' }}>
             <CCardImage orientation="top" src={test_url.slice(0, -1)+product.photo_url} />
             <CCardBody>
               <CCardTitle>{product?.product_name}</CCardTitle>
               <CCardText>
               <span style={{color:product?.status=="pending"?"red":"green"}}> ({product?.status})</span><br></br>
                {product?.description}
               </CCardText>
               (asked price)
               <h3>${product?.asked_price}</h3>
  
               <div>
               <CButton onClick={()=>{
                 window.open(`${product?.product_drop_shipping_url}`, "_blank");
               }
              
              } style={{marginRight:"0.3rem"}} >View Link</CButton>
               <CButton onClick={()=>{
                setForm({
                  product:product.id
                })
                showDrawer()
                
                }} variant="outline">Offered Price</CButton>
               </div>
             </CCardBody>
           </CCard>
         </CCol>
        ))}
      
        
      </CRow>
      

    </>
  )
}

export default ProductsAdmin
