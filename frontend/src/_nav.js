import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilStar } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
        {
        component: CNavItem,
        name: 'User',
        to: '/user',
      },
    ],
  },
]

export default _nav
