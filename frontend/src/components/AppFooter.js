import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          D@rkV@mpire
        </a>
        <span className="ms-1">&copy; 2025 unknow_artist</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Dark Vampire</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          Registration &amp; Website
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
