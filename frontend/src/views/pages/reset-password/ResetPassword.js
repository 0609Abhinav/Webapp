// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilLockLocked } from '@coreui/icons';

// const ResetPassword = () => {
//   const { token } = useParams(); // Get token from URL
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//     console.log("Sending reset password request:", { token, newPassword });
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//      const res = await axios.post('http://localhost:3002/api/users/reset-password', {
//   token,
//   password: newPassword, // try 'password' instead of 'newPassword'
// });

//       setSuccess(res.data.message || 'Password reset successfully');
//       setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
//     } catch (err) {
//       console.error('Reset password error:', err);
//       setError(
//         err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={6}>
//             <CCard>
//               <CCardBody>
//                 <CForm onSubmit={handleResetPassword}>
//                   <h1>Reset Password</h1>
//                   <p className="text-body-secondary">Enter your new password</p>

//                   {error && <p className="text-danger">{error}</p>}
//                   {success && <p className="text-success">{success}</p>}

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="New Password"
//                       autoComplete="new-password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       required
//                     />
//                   </CInputGroup>

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="Confirm Password"
//                       autoComplete="new-password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       required
//                     />
//                   </CInputGroup>

//                   <CRow>
//                     <CCol xs={6}>
//                       <CButton type="submit" color="primary" disabled={loading}>
//                         {loading ? 'Resetting...' : 'Reset Password'}
//                       </CButton>
//                     </CCol>
//                     <CCol xs={6} className="text-right">
//                       <CButton color="link" onClick={() => navigate('/login')}>
//                         Back to Login
//                       </CButton>
//                     </CCol>
//                   </CRow>
//                 </CForm>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default ResetPassword;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCol,
//   CContainer,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilLockLocked } from '@coreui/icons';

// const ResetPassword = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Redirect if token is missing
//   useEffect(() => {
//     if (!token) {
//       setError('Invalid or missing reset token.');
//     }
//   }, [token]);

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!token) return;

//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:3002/api/users/reset-password', {
//         token,
//         password: newPassword,
//       });
//       setSuccess(res.data.message || 'Password reset successfully!');
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.message ||
//           'Failed to reset password. The link may be invalid or expired.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!token) {
//     return (
//       <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//         <CContainer>
//           <CRow className="justify-content-center">
//             <CCol md={6}>
//               <CCard>
//                 <CCardBody>
//                   <h1>Error</h1>
//                   <p className="text-danger">{error}</p>
//                   <CButton color="primary" onClick={() => navigate('/login')}>
//                     Back to Login
//                   </CButton>
//                 </CCardBody>
//               </CCard>
//             </CCol>
//           </CRow>
//         </CContainer>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={6}>
//             <CCard>
//               <CCardBody>
//                 <CForm onSubmit={handleResetPassword}>
//                   <h1>Reset Password</h1>
//                   <p className="text-body-secondary">Enter your new password</p>

//                   {error && <p className="text-danger">{error}</p>}
//                   {success && <p className="text-success">{success}</p>}

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="New Password"
//                       autoComplete="new-password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       required
//                     />
//                   </CInputGroup>

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <CIcon icon={cilLockLocked} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="Confirm Password"
//                       autoComplete="new-password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       required
//                     />
//                   </CInputGroup>

//                   <CRow>
//                     <CCol xs={6}>
//                       <CButton type="submit" color="primary" disabled={loading}>
//                         {loading ? 'Resetting...' : 'Reset Password'}
//                       </CButton>
//                     </CCol>
//                     <CCol xs={6} className="text-right">
//                       <CButton color="link" onClick={() => navigate('/login')}>
//                         Back to Login
//                       </CButton>
//                     </CCol>
//                   </CRow>
//                 </CForm>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   );
// };

// export default ResetPassword;


//--------------------->
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked } from '@coreui/icons';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill out both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    try {
      // ✅ Token is now in URL params
      const res = await axios.post(`http://localhost:3002/api/users/reset-password/${token}`, {
        password: newPassword,
      });

      setSuccess(res.data.message || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to reset password. The link may be invalid or expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard>
              <CCardBody>
                <CForm onSubmit={handleResetPassword}>
                  <h1>Reset Password</h1>
                  <p className="text-body-secondary">Enter your new password below</p>

                  {error && <p className="text-danger">{error}</p>}
                  {success && <p className="text-success">{success}</p>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <CButton color="link" onClick={() => navigate('/login')}>
                        Back to Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;

