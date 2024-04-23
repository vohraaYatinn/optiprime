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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Alert, Button, Drawer, Modal, Radio, Space } from 'antd'
import ReactImg from 'src/assets/images/react.jpg'

import Cart from 'src/components/Cart'
import { updateUserCoins, userDetails } from 'src/redux/reducers/userDetails.reducer'
import { fetchCart, productFetchCustomer, placeFetchCart, cartQuantity, placeOrder, productAddCustomer } from 'src/urls/urls'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from 'src/network/useAxios'
import { useRouter } from 'src/hooks/use-router'
import Input from 'antd/es/input/Input'
import { test_url } from 'src/config/environment';


const ProductsCustomer = () => {
  const profile = useSelector(userDetails);

  //use axios
  const [productsResponse, productsError, productsLoading, fetchProducts] = useAxios();
  const [CartResponse, errorCart, loadingCart, fetchCartResponse] = useAxios();
  const [CartResponsePlace, errorPlaceCart, loadingPlaceCart, placeCartResponse] = useAxios();
  const [getCartAfterOrderResponse, getCartAfterOrderError, getCartAfterOrderLoading, getCartAfterOrderFetch] = useAxios();
  const [cartQuantityResponse, cartQuantityError, cartQuantityLoading, cartQuantityFetch] = useAxios();
  const [placeOrderResponse, placeOrderError, placeOrderLoading, placeOrderFetch] = useAxios();
  const [orderAddResponse, orderAdderror, orderAddloading, orderAddfetch] = useAxios();


  //useState
  const [open, setOpen] = useState(false)
  const [productsData, setProductsData] = useState([])
  const [cartOrders, setCartOrders] = useState([]);
  const [productForm, setProductForm] = useState({

    email:profile?.email
  });
  const router = useRouter();
  const [width, setWidth] = useState(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  const isMobile = width <= 675;
  const [message, setMessage] = useState({
    showMessage: false,
    isError:"",
    message:""
  });
  const [addCustomerAdress, setAddCustomerAddress] = useState("")
  //function
  const submitForm = () => {
    if(profile.user_coins.length > 0 && profile.user_coins[0]?.coin < 1000){
      router.push('/amount/:topuprequired');
    }
    else{
    orderAddfetch(productAddCustomer(productForm));
  }
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const fetchCustomerOrders = () => {
    fetchProducts(productFetchCustomer({ email:profile?.email }));
  };
  const fetchCartOrders = () => {
    fetchCartResponse(fetchCart({ email:profile?.email}));
  };
  const fetchCartOrdersAfterOrder = () => {
    getCartAfterOrderFetch(fetchCart({ email:profile?.email}));
  };
  const fetchCustomerQuantity = (order, quantity) => {
    cartQuantityFetch(cartQuantity({ order:order.id, quantity:quantity}));
  };
  const placeOrderFun = () => {
    placeOrderFetch(placeOrder({...cartOrders, address:addCustomerAdress}))
  }
  // const placeCart = (id, action) => {
  //   placeCartResponse(adminOrderActions({ orderId:id, status: action}));
  // };

  //useEffect

  useEffect(()=>{
    if(profile?.email){
      fetchCustomerOrders()
      fetchCartOrders()
    }
  },[profile])
  const dispatch = useDispatch();

  useEffect(()=>{
    if(placeOrderResponse?.result == "success"){
      if(placeOrderResponse?.coins){
        dispatch(updateUserCoins(placeOrderResponse?.coins));
      }
      onClose()
      customerAddressModalVisible(false)

      fetchCustomerOrders()
      setMessage((prev)=>({...prev, 
        showMessage: true,
        isError:false,
        message:"Your order has been placed successfully, You can check them in your order section"
      }))
      
    }

  },[placeOrderResponse])
  useEffect(()=>{
    if(CartResponsePlace?.result == "success"){
      fetchCartOrdersAfterOrder()
    }
  },[CartResponsePlace])
  useEffect(()=>{
    if(cartQuantityResponse?.result == "success"){
      fetchCartOrders()
    }
  },[cartQuantityResponse])
  useEffect(()=>{
    if(productsResponse?.result == "success" && productsResponse?.data){
      setProductsData(productsResponse?.data)
    }
    },[productsResponse])
    useEffect(()=>{
      if(CartResponse?.result == "success"){
        setCartOrders(CartResponse?.data)
      }
  
    },[CartResponse])
    useEffect(()=>{
      if(getCartAfterOrderResponse?.result == "success"){
        setCartOrders(getCartAfterOrderResponse?.data)
        showDrawer()
      }
  
    },[getCartAfterOrderResponse])

    const [modalVisible, setModalVisible] = useState(false);
    const [customerAddressVisible, customerAddressModalVisible] = useState(false);

    const handleOpenModal = () => {
    
        setModalVisible(true);

    };
  
    const handleCloseModal = () => {
      setModalVisible(false);
    };
    useEffect(()=>{
      if(orderAddResponse?.result == "success"){
        handleCloseModal()
        fetchCustomerOrders()
        setMessage((prev)=>({...prev, 
          showMessage: true,
          isError:false,
          message:orderAddResponse?.message
        }))
      }
  
    },[orderAddResponse])
    useEffect(()=>{
      if(placeOrderResponse?.result == "failure"){
        onClose()
        customerAddressModalVisible(false)
  
        fetchCustomerOrders()
        setMessage((prev)=>({...prev, 
          showMessage: true,
          isError:true,
          message:placeOrderResponse?.message
        }))
      }
  
    },[placeOrderResponse])
  return (
    <>
      <CCol xs>
      {message.showMessage && <div className='mb-3'><Alert message={message?.message} closable type={message?.isError?"error":"success"} onClose={()=>setMessage((prev)=>({...prev, message:"", isError:false, showMessage:false}))
} /></div>}
        <CCard className="mb-4">
          <CCardHeader style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
            Products Insights
            </div>
            <Button style={{border:"1px solid "}}
            onClick={handleOpenModal}
            >
              Add New Product
            </Button>
            
            </CCardHeader>
            <CModal
        backdrop="static"
      visible={modalVisible}
      aria-labelledby="StaticBackdropExampleLabel"
      className='mobile-product'
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">
         <h3> Add New Product </h3>
          </CModalTitle>
      </CModalHeader>
      <CModalBody style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
        <Input placeholder='Product Name'
        onChange={(e)=>setProductForm((prev)=>({...prev,
          label:e.target.value
        }))}
        />
        <Input placeholder='Dropshipping Url' style={{height:"5rem"}}
                onChange={(e)=>setProductForm((prev)=>({...prev,
                  link:e.target.value
                  }))}
        />
                <Input placeholder='Add Description of the product' style={{height:"8rem"}}
                onChange={(e)=>setProductForm((prev)=>({...prev,
                  description:e.target.value
                  }))}
        />
        <Input placeholder='What Price You would like to give for this product'
                onChange={(e)=>setProductForm((prev)=>({...prev,
                  price:e.target.value
                  }))}
        />
        <div>
          <p style={{color:"red"}} >*Upload Photo of this product</p>
        <Input placeholder='Product Photo'type="file" style={{marginTop:"-0.5rem"}}
        onChange={(e)=>setProductForm((prev)=>({...prev,
          photo:e.target.files[0]
                  }))}
/>
        </div>

              </CModalBody>
      <CModalFooter>
      <CButton 
      color=''
        onClick={()=>setModalVisible(false)}
        >Return</CButton>
        <CButton color="primary" style={{color:"white"}}
        onClick={()=>submitForm()}
        >Submit</CButton>
      </CModalFooter>
    </CModal>
    <CModal
        backdrop="static"
      visible={customerAddressVisible}
      aria-labelledby="StaticBackdropExampleLabel"
      className='mobile-product-cart'

    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">
         <h3> Add Customer Address </h3>
          </CModalTitle>
      </CModalHeader>
      <CModalBody style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
     
        <Input placeholder='What Price You would like to give for this product'
        style={{height:"5rem"}}
                onChange={(e)=>setAddCustomerAddress(e.target.value)}
        />
        

              </CModalBody>
      <CModalFooter>

      <CButton 
        onClick={()=>customerAddressModalVisible(false)}
        color=''
        >Return</CButton>
        <CButton color="primary" style={{color:"white"}}
        onClick={()=>placeOrderFun()}
        >Order</CButton>
      </CModalFooter>
    </CModal>
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

            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CRow>

{productsData.map((product) => (
           <CCol xs={12} sm={12} lg={3} key={product.id}>
           <CCard style={{ width: '18rem', marginTop: '1rem' }}>
           <CCardImage orientation="top" src={test_url.slice(0, -1)+product.photo_url} />
             <CCardBody>
               <CCardTitle>{product?.product_name}</CCardTitle>
               <CCardText>
               <span style={{color:product?.status=="pending"?"red":"green"}}> ({product?.status})</span><br></br>
                {product?.description}
               </CCardText>
               <h3>${product?.quoted_price || <span style={{color:"red", fontSize:"0.8rem"}}>pending</span>}</h3>
               <div>
               <CButton onClick={()=>{
                 window.open(`${product?.product_drop_shipping_url}`, "_blank");
               }
              
              } style={{marginRight:"0.3rem"}} >View Product</CButton>
               <CButton onClick={()=>{
                    placeCartResponse(placeFetchCart({
                      productId:product.id
                    }))
                
                }} variant="outline"
                disabled={product?.status=="pending"}
                >Add to cart</CButton>
               </div>
             </CCardBody>
           </CCard>
         </CCol>
        ))}
      
        
      </CRow>
      
      <Drawer
        title="Cart"
        placement={'bottom'}
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={()=>
              customerAddressModalVisible(true)
              
              }>
              Order
            </Button>
        </Space>
        }
      >
       <Cart cartOrders={cartOrders} cartFunction={fetchCustomerQuantity} isMobile={isMobile}/>
      </Drawer>
    </>
  )
}

export default ProductsCustomer
