/* eslint-disable */
import { CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CRow } from '@coreui/react';
import { Card } from 'antd';
import React from 'react';
import { test_url } from 'src/config/environment';

const Cart = ({ cartOrders, cartFunction, isMobile }) => {
  return (
    <div style={{paddingLeft:"20rem"}} className='mobile-card-pad'>

        {cartOrders.map((order, index) => (
                  <CRow style={{marginTop:"0.5rem"}}>
          <CCol key={index} xs={12} sm={6} lg={10}>
            <CCard>
              <CCardBody style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {!isMobile &&
                <div>
                  <img src={test_url.slice(0, -1)+order.product_obj.photo_url} alt="" 
                  style={{height:"10rem", width:"10rem", marginRight:"2rem"}}
                  /> {/* Assuming each order object has an 'image' property */}
                </div> }

                <div>
                  <CCardTitle>{order.product_obj.product_name}</CCardTitle> {/* Assuming each order object has a 'title' property */}
                
                  {!isMobile &&
                  <CCardText>
                    {order.product_obj.description}
                  </CCardText>}


                  <CCardText style={{ fontSize: "1.4rem" }}>
                    $  {order.product_obj.quoted_price * order.quantity}
                  </CCardText>
                </div>
                <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <button className="btn btn-outline-primary" type="button" id="decrement-btn"
                      onClick={()=>cartFunction(order, parseInt(order?.quantity)-1)}
                      
                      >-</button>
                    </div>
                    <input
                      type="text"
                      className="form-control text-center"
                      id="quantity-input"
                      value={order?.quantity}
                      readOnly
                    />
                    <div className="input-group-append">
                      <button className="btn btn-outline-primary" type="button" id="increment-btn"
                        onClick={()=>cartFunction(order, parseInt(order?.quantity)+1)}
                      >+</button>
                    </div>
                  </div>

                  <CButton color='danger' 
                  onClick={()=>cartFunction(order, 0)}
                  style={{ color: "white" }}>Remove</CButton>

                </div>
              </CCardBody>
            </CCard>
          </CCol>
          </CRow>
        ))}
    
    </div>
  );
}

export default Cart;