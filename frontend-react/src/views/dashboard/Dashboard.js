/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { LoadingOutlined, SmileOutlined, DollarCircleOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { Steps } from 'antd'
import useAxios from 'src/network/useAxios';
import { useSelector } from 'react-redux';
import { userDetails } from 'src/redux/reducers/userDetails.reducer';
import { dashboardFetchDetails } from 'src/urls/urls';

const Dashboard = () => {
  const profile = useSelector(userDetails);
  const refresh = localStorage.getItem('refresh');
  useEffect(()=>{
    if (refresh && refresh == 1){
      localStorage.setItem('refresh', 2);
      window.location.reload();
    }
  })

  const [fileResponse, error, loading, fetch] = useAxios();
  const fetchDashboardData = () => {
    if(profile?.email) fetch(dashboardFetchDetails({ email: profile?.email }));
  };
    const [dashboardCounts, setDashboardCounts] = useState({
    total_orders:false,
    orderLastWeek: false,
    pendingQuery: false,
    pendingOrders: false,
    orderDelivered: false,
    graphOrders: false,
    Insights:false
  });
  useEffect(() => {
    fetchDashboardData();
  }, [profile]);
  useEffect(() => {
    if (fileResponse?.result == 'success' && fileResponse?.data) {
      setDashboardCounts((prev) => ({
        ...prev,
        total_orders: fileResponse?.data?.total_orders,
        orderLastWeek: fileResponse?.data?.orderLastWeek,
        pendingQuery: fileResponse?.data?.pendingQuery,
        pendingOrders: fileResponse?.data?.pendingOrders,
        orderDelivered: fileResponse?.data?.orderDelivered,
        graphOrders: fileResponse?.data?.graphOrders,
        Insights:fileResponse?.data?.Insights
      }));
    }
  }, [fileResponse]);


  const progressExample = [
    { title: 'Total Amount', value: profile.user_coins.length > 0 ? profile.user_coins[0]?.coin : "N/A", percent: 40, color: 'success' },
    { title: 'Last Transaction', value: dashboardCounts?.Insights?.last_transaction, percent: 20, color: 'info' },
    { title: 'Last Topup', value: dashboardCounts?.Insights?.last_topup, percent: 60, color: 'warning' },
    { title: 'Last Withdraw', value: dashboardCounts?.Insights?.last_withdraw, percent: 80, color: 'danger' },  ]

  return (
    
    <>
      <WidgetsDropdown dashboardCounts={dashboardCounts}/>
     {profile.user_coins.length > 0 && profile.user_coins[0]?.coin <= 100 &&
      <Steps
      className='mobile-steps-track'
      style={{marginBottom:"1rem"}}
    items={[
      {
        title: 'Login',
        status: 'finish',
        icon: <UserOutlined />,
      },
      {
        title: 'Topup Amount',
        status: 'process',
        icon: <LoadingOutlined />,
      },
      {
        title: 'List Products',
        status: 'wait',
        icon: <SmileOutlined />,
      },
      {
        title: 'Place Order',
        status: 'wait',
        icon: <ShoppingCartOutlined />,
      },
    ]}
  />
}

      <CCard className="mb-4">
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  $ {item.value} 
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={100} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

      {/* <WidgetsBrand withCharts /> */}
     
      <CRow>
      <CCol xs={12} sm={6} lg={8}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{

                labels: ['December','January', 'February', 'March', 'April', 'May', 'June'],
                datasets: [
                  {
                    label: 'Orders Placed',
                    backgroundColor: '#f87979',
                    data: dashboardCounts?.graphOrders?.order_counts_list,
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} sm={6} lg={4}>
        <CCard className="mb-4">
          <CCardHeader>Pie Chart</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: ['Pending', 'Delivered'],
                datasets: [
                  {
                    data: [dashboardCounts?.graphOrders?.order_counts_list_pending, dashboardCounts?.graphOrders?.order_counts_list_delivered],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
