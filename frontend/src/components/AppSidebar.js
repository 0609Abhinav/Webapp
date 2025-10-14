import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons' // person icon

import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const handleSidebarVisibility = (visible) => {
    dispatch({ type: 'set', sidebarShow: visible })
  }

  const toggleUnfoldable = () => {
    dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={handleSidebarVisibility}
    >
      {/* Sidebar Header */}
      <CSidebarHeader className="border-bottom d-flex align-items-center justify-content-between">
        <CSidebarBrand to="/" className="d-flex align-items-center gap-2">
          {/* Person icon */}
          <CIcon icon={cilUser} height={32} className="text-white" />

          {/* App Name with 2 colors & fonts */}
          <span className="d-flex align-items-center gap-1">
            <span
              style={{
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              Dark
            </span>
            <span
              style={{
                color: '#ff4d4f', // red
                fontFamily: 'Georgia, serif',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              Vampire
            </span>
          </span>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          aria-label="Close sidebar"
          onClick={() => handleSidebarVisibility(false)}
        />
      </CSidebarHeader>

      {/* Navigation */}
      <AppSidebarNav items={navigation} />

      {/* Sidebar Footer */}
      <CSidebarFooter className="border-top d-none d-lg-flex justify-content-center">
        <CSidebarToggler aria-label="Toggle sidebar" onClick={toggleUnfoldable} />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
