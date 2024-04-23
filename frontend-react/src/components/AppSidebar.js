/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import translogo from "src/components/OPTIPRIMETrans1.png"
// sidebar nav config
import {_customer_nav, __admin_nav} from '../_nav'
import { changeState, sidebarShowAct, userDetails } from 'src/redux/reducers/userDetails.reducer'


const AppSidebar = () => {
  const profile = useSelector(userDetails);
  const showAct = useSelector(sidebarShowAct);
  const [navigation, setNavigation] = useState([]);


  useEffect(()=>{
    if(profile?.role == "customer"){
      setNavigation(_customer_nav)
    }
    else if(profile?.role == "admin"){
      setNavigation(__admin_nav)
    }

  },[profile])
  const dispatch = useDispatch()

  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [setVisible, setVisibleState] = useState(false)
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
  useState(()=>{
    setVisibleState(showAct)
  },[showAct])
  return (
    <CSidebar
      position="fixed"
      unfoldable={isMobile && false}
      visible={isMobile ? showAct : true}
      onVisibleChange={(visible) => {
        dispatch(changeState(visible))
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img src={translogo} style={{width:"80%", height:"auto", marginBottom:"2rem", marginTop:"1.5rem", marginLeft:"-3rem"}}/>
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
