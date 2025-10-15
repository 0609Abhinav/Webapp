import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilStar, cilUser, cilChatBubble } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Chatbot',
        to: '/chat',
        icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav
