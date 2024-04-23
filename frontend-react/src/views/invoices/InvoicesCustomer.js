/* eslint-disable */
import React, { useEffect, useState } from 'react'

import {
  CButton,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import { InvoiceFetch } from 'src/urls/urls'
import useAxios from 'src/network/useAxios'
import moment from 'moment'
import { userDetails } from 'src/redux/reducers/userDetails.reducer'
import { useSelector } from 'react-redux'
import convertToPDF from 'src/components/convertToPdf'
import { useRouter } from 'src/hooks/use-router'
import opti from "./optiprime.jpeg"
const InvoiceCustomer = () => {
  const profile = useSelector(userDetails);
  const router = useRouter();
  const [invoiceResponse, error, loading, Invoicefetch] = useAxios();

  //use State
  const [invoices , setInvoices] = useState([]);

  // Functions
  const mainCallingFunction = () => {
    fetchAllInvoices()
  }

  const fetchAllInvoices = () => {
    Invoicefetch(InvoiceFetch({ email: profile?.email }));
  };


  // UseStates
  useEffect(()=>{
    mainCallingFunction()
  },[])

  useEffect(()=>{
    if(invoiceResponse?.result == "success"){
      setInvoices(invoiceResponse?.data)
    }
  },[invoiceResponse])

  const handleConvertToPDF = (paymentCheck) => {
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
          <h6>#${paymentCheck?.unique_id}</h6>
          <div class="mb-1">
            <span>Date Issues:</span>
            <span>${moment(paymentCheck?.created_at).format('MMMM DD, YYYY  -  HH:mm:ss')}</span>
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
  

            <td>$${paymentCheck?.amount}</td>
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
              <h6 class="mb-0 pt-1">$${paymentCheck?.amount}</h6>
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

  }




  return (
    <>

      <CRow>
        <CCol xs>
        <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                  <CTableHeaderCell className="text-center">S No.</CTableHeaderCell>

                    <CTableHeaderCell>Invoice</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Amount</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Payment Method</CTableHeaderCell>
                    <CTableHeaderCell>Date & Time</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {invoices.map((row, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                       {index+1}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{row.unique_id}</div>
                        <div className="small text-medium-emphasis">
                          {row.user.full_name}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                      $ {(row.amount).toString()}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div style={{display:"flex", flexDirection:"column", gap:"0.5rem"}}>
                        <CButton  color={"light"}
                        onClick={()=>handleConvertToPDF(row)}
                        >Download</CButton>

                        <CButton variant={"outline"} color={"success"}
                        onClick={()=>{
                          const text = encodeURIComponent(`
Hi, 
I wanted to have a conversation regarding this invoice 
Invoice Number : ${row.unique_id}
amount : $ ${row?.amount}
                          `)
                          window.open(`${"https://wa.me/+31647694329?text="}${text}`, "_blank");}}
                        >Whatsapp</CButton>
                       
                        </div>
                        {/* <CIcon size="xl" icon={item.country.flag} title={item.country.name} /> */}
                      </CTableDataCell>
                
                      <CTableDataCell className="text-center">
                        Net Banking
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">Created at</div>
                        {row?.created_at && moment(row?.created_at).format('MMMM DD, YYYY  -  HH:mm:ss')}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
        </CCol>
      </CRow>
    </>
  )
}

export default InvoiceCustomer
