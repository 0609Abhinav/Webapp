import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import routes from '../routes'
import { CSpinner } from '@coreui/react'

const AppContent = () => {
  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        {routes.map((route, idx) =>
          route.element ? (
            <Route key={idx} path={route.path} element={<route.element />} />
          ) : null
        )}
      </Routes>
    </Suspense>
  )
}

export default AppContent
