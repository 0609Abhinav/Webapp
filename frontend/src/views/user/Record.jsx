// 4
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CFormTextarea,
//   CRow,
//   CCol,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableBody,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
//   CFormFeedback,
//   CInputGroup,
//   CInputGroupText,
//   CPagination,
//   CPaginationItem,
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import {
//   cilUser,
//   cilEnvelopeOpen,
//   cilPhone,
//   cilCalendar,
//   cilHome,
//   cilMap,
//   cilPencil,
//   cilTrash,
// } from '@coreui/icons';

// const RecordsTable = () => {
//   const [records, setRecords] = useState([]);
//   const [formData, setFormData] = useState({
//     full_Name: '',
//     email: '',
//     phone: '',
//     gender: '',
//     dob: '',
//     state_name: '',
//     city: '',
//     address: '',
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [pagination, setPagination] = useState({
//     pageNumber: 1,
//     pageSize: 5,
//     totalPages: 0,
//     totalRecords: 0,
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState('id');
//   const [sortOrder, setSortOrder] = useState('ASC');
//   const [errors, setErrors] = useState({});
//   const pageSizeOptions = [5, 8, 10];

//   useEffect(() => {
//     fetchRecords();
//   }, [pagination.pageNumber, searchTerm, sortField, sortOrder]);

//   const fetchRecords = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:3002/api/records', {
//         params: {
//           pageSize: pagination.pageSize,
//           pageNumber: pagination.pageNumber,
//           searchTerm,
//           sortField,
//           sortOrder,
//         },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRecords(response.data.data);
//       setPagination((prev) => ({
//         ...prev,
//         totalPages: response.data.totalPages,
//         totalRecords: response.data.totalRecords,
//       }));
//     } catch (error) {
//       console.error('Error fetching records:', error);
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.full_Name.trim()) newErrors.full_Name = 'Full Name is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//     if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
//     else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
//     if (!formData.gender) newErrors.gender = 'Gender is required';
//     if (!formData.dob) newErrors.dob = 'Date of Birth is required';
//     if (!formData.state_name.trim()) newErrors.state_name = 'State is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.address.trim()) newErrors.address = 'Address is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'phone' && value.length > 10) return;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const token = localStorage.getItem('token');

//       if (editingId) {
//         await axios.put(`http://localhost:3002/api/records/${editingId}`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } else {
//         await axios.post(`http://localhost:3002/api/records`, formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }

//       setFormData({
//         full_Name: '',
//         email: '',
//         phone: '',
//         gender: '',
//         dob: '',
//         state_name: '',
//         city: '',
//         address: '',
//       });
//       setEditingId(null);
//       setErrors({});
//       fetchRecords();
//     } catch (error) {
//       console.error('Error saving record:', error);
//       alert(error.response?.data?.message || 'Failed to save record');
//     }
//   };

//   const handleEdit = (record) => {
//     setFormData({
//       full_Name: record.full_Name,
//       email: record.email,
//       phone: record.phone || '',
//       gender: record.gender || '',
//       dob: record.dob || '',
//       state_name: record.state_name || '',
//       city: record.city || '',
//       address: record.address || '',
//     });
//     setEditingId(record.id);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (record) => {
//     if (!window.confirm('Are you sure you want to delete this record?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:3002/api/records/${record.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchRecords();
//     } catch (error) {
//       console.error('Error deleting record:', error);
//     }
//   };

//   const handlePageChange = (page) => setPagination((prev) => ({ ...prev, pageNumber: page }));
//   const handleSort = (field) => {
//     setSortField(field);
//     setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
//   };
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setPagination((prev) => ({ ...prev, pageNumber: 1 }));
//   };

//   return (
//     <div>
//       {/* FORM CARD */}
//       <CCard className="shadow-sm mb-4">
//         <CCardHeader style={{ backgroundColor: '#755c59ff', color: 'white' }}>
//           <h4 className="mb-0">{editingId ? 'Edit Record' : 'Add New Record'}</h4>
//         </CCardHeader>
//         <CCardBody>
//           <CForm onSubmit={handleSubmit}>
//             <CRow className="g-3">
//               {/* Full Name */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     placeholder="Full Name *"
//                     name="full_Name"
//                     value={formData.full_Name}
//                     onChange={handleChange}
//                     invalid={!!errors.full_Name}
//                   />
//                   <CFormFeedback invalid>{errors.full_Name}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Email */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilEnvelopeOpen} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="email"
//                     placeholder="Email *"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     invalid={!!errors.email}
//                   />
//                   <CFormFeedback invalid>{errors.email}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Phone */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilPhone} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="number"
//                     placeholder="Phone *"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     invalid={!!errors.phone}
//                   />
//                   <CFormFeedback invalid>{errors.phone}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Gender */}
//               <CCol md={4}>
//                 <CFormSelect
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   invalid={!!errors.gender}
//                 >
//                   <option value="">Select Gender *</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </CFormSelect>
//                 {errors.gender && <span style={{ color: 'red', fontSize: '12px' }}>{errors.gender}</span>}
//               </CCol>

//               {/* DOB */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilCalendar} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleChange}
//                     invalid={!!errors.dob}
//                   />
//                   {errors.dob && <span style={{ color: 'red', fontSize: '12px' }}>{errors.dob}</span>}
//                 </CInputGroup>
//               </CCol>

//               {/* State */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilMap} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     placeholder="State *"
//                     name="state_name"
//                     value={formData.state_name}
//                     onChange={handleChange}
//                     invalid={!!errors.state_name}
//                   />
//                   <CFormFeedback invalid>{errors.state_name}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* City */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilHome} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     placeholder="City *"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     invalid={!!errors.city}
//                   />
//                   <CFormFeedback invalid>{errors.city}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Address */}
//               <CCol md={12}>
//                 <CFormTextarea
//                   rows={2}
//                   placeholder="Address *"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   invalid={!!errors.address}
//                 />
//                 <CFormFeedback invalid>{errors.address}</CFormFeedback>
//               </CCol>

//               {/* Submit */}
//               <CCol xs={12} className="text-end mt-3">
//                 <CButton color="primary" type="submit" className="px-4">
//                   {editingId ? 'Update Record' : 'Add Record'}
//                 </CButton>
//               </CCol>
//             </CRow>
//           </CForm>
//         </CCardBody>
//       </CCard>

//       {/* TABLE CARD */}
//       <CCard className="shadow-sm">
//         <CCardHeader style={{ backgroundColor: '#3498db', color: 'white' }}>
//           <h4 className="mb-0">Records List</h4>
//         </CCardHeader>
//         <CCardBody>
//           <CInputGroup className="mb-3">
//             <CFormInput
//               type="text"
//               placeholder="Search by name or email"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </CInputGroup>
//           <CTable hover responsive>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell onClick={() => handleSort('id')}>
//                   ID {sortField === 'id' && (sortOrder === 'ASC' ? '↑' : '↓')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell onClick={() => handleSort('full_Name')}>
//                   Full Name {sortField === 'full_Name' && (sortOrder === 'ASC' ? '↑' : '↓')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell onClick={() => handleSort('email')}>
//                   Email {sortField === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell>Phone</CTableHeaderCell>
//                 <CTableHeaderCell>Gender</CTableHeaderCell>
//                 <CTableHeaderCell>DOB</CTableHeaderCell>
//                 <CTableHeaderCell>State</CTableHeaderCell>
//                 <CTableHeaderCell>City</CTableHeaderCell>
//                 <CTableHeaderCell>Address</CTableHeaderCell>
//                 <CTableHeaderCell>Actions</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.map((record) => (
//                 <CTableRow key={record.id}>
//                   <CTableDataCell>{record.id}</CTableDataCell>
//                   <CTableDataCell>{record.full_Name}</CTableDataCell>
//                   <CTableDataCell>{record.email}</CTableDataCell>
//                   <CTableDataCell>{record.phone}</CTableDataCell>
//                   <CTableDataCell>{record.gender}</CTableDataCell>
//                   <CTableDataCell>{record.dob}</CTableDataCell>
//                   <CTableDataCell>{record.state_name}</CTableDataCell>
//                   <CTableDataCell>{record.city}</CTableDataCell>
//                   <CTableDataCell>{record.address}</CTableDataCell>
//                   <CTableDataCell>
//                     <CButton color="info" size="sm" className="me-2" onClick={() => handleEdit(record)}>
//                       <CIcon icon={cilPencil} />
//                     </CButton>
//                     <CButton color="danger" size="sm" onClick={() => handleDelete(record)}>
//                       <CIcon icon={cilTrash} />
//                     </CButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>

//           {/* Pagination */}
//           <CPagination align="center" className="mt-3">
//             <CPaginationItem
//               disabled={pagination.pageNumber === 1}
//               onClick={() => handlePageChange(pagination.pageNumber - 1)}
//             >
//               Previous
//             </CPaginationItem>
//             {[...Array(pagination.totalPages).keys()].map((page) => (
//               <CPaginationItem
//                 key={page + 1}
//                 active={page + 1 === pagination.pageNumber}
//                 onClick={() => handlePageChange(page + 1)}
//               >
//                 {page + 1}
//               </CPaginationItem>
//             ))}
//             <CPaginationItem
//               disabled={pagination.pageNumber === pagination.totalPages}
//               onClick={() => handlePageChange(pagination.pageNumber + 1)}
//             >
//               Next
//             </CPaginationItem>
//           </CPagination>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default RecordsTable;
// import React, { useState, useEffect, useCallback, useMemo } from 'react'
// import axios from 'axios'
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CFormTextarea,
//   CRow,
//   CCol,
//   CButton,
//   CTable,
//   CTableHead,
//   CTableBody,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
//   CFormFeedback,
//   CInputGroup,
//   CInputGroupText,
//   CPagination,
//   CPaginationItem,
//   CToast,
//   CToastHeader,
//   CToastBody,
//   CToaster,
// } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilUser,
//   cilEnvelopeOpen,
//   cilPhone,
//   cilCalendar,
//   cilHome,
//   cilMap,
//   cilPencil,
//   cilTrash,
//   cilCheckCircle,
//   cilXCircle,
// } from '@coreui/icons'

// const RecordsTable = () => {
//   // -------------------- STATE --------------------
//   const [records, setRecords] = useState([])
//   const [formData, setFormData] = useState({
//     full_Name: '',
//     email: '',
//     phone: '',
//     gender: '',
//     dob: '',
//     state_name: '',
//     city: '',
//     address: '',
//   })
//   const [editingId, setEditingId] = useState(null)
//   const [errors, setErrors] = useState({})
//   const [searchTerm, setSearchTerm] = useState('')
//   const [sortField, setSortField] = useState('id')
//   const [sortOrder, setSortOrder] = useState('ASC')
//   const [pagination, setPagination] = useState({
//     pageNumber: 1,
//     pageSize: 5,
//     totalPages: 0,
//     totalRecords: 0,
//   })

//   const pageSizeOptions = useMemo(() => [5, 8, 10], [])
//   const [toasts, setToasts] = useState([])

//   // -------------------- TOAST HANDLER --------------------
//   const showToast = (message, type = 'success') => {
//     setToasts((prev) => [
//       ...prev,
//       { id: Date.now(), message, type, visible: true },
//     ])
//   }

//   // -------------------- API CALLS --------------------
//   const fetchRecords = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token')
//       const { data } = await axios.get('http://localhost:3002/api/records', {
//         params: {
//           pageSize: pagination.pageSize,
//           pageNumber: pagination.pageNumber,
//           searchTerm,
//           sortField,
//           sortOrder,
//         },
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       setRecords(data.data || [])
//       setPagination((prev) => ({
//         ...prev,
//         totalPages: data.totalPages,
//         totalRecords: data.totalRecords,
//       }))
//     } catch (error) {
//       console.error('Error fetching records:', error)
//       showToast('Failed to fetch records', 'danger')
//     }
//   }, [pagination.pageSize, pagination.pageNumber, searchTerm, sortField, sortOrder])

//   useEffect(() => {
//     fetchRecords()
//   }, [fetchRecords])

//   // -------------------- VALIDATION --------------------
//   const validate = useCallback(() => {
//     const newErrors = {}
//     const { full_Name, email, phone, gender, dob, state_name, city, address } = formData

//     if (!full_Name.trim()) newErrors.full_Name = 'Full Name is required'
//     if (!email.trim()) newErrors.email = 'Email is required'
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'

//     if (!phone.trim()) newErrors.phone = 'Phone is required'
//     else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits'

//     if (!gender) newErrors.gender = 'Gender is required'
//     if (!dob) newErrors.dob = 'Date of Birth is required'
//     if (!state_name.trim()) newErrors.state_name = 'State is required'
//     if (!city.trim()) newErrors.city = 'City is required'
//     if (!address.trim()) newErrors.address = 'Address is required'

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }, [formData])

//   // -------------------- FORM HANDLERS --------------------
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     if (name === 'phone' && value.length > 10) return
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const resetForm = useCallback(() => {
//     setFormData({
//       full_Name: '',
//       email: '',
//       phone: '',
//       gender: '',
//       dob: '',
//       state_name: '',
//       city: '',
//       address: '',
//     })
//     setEditingId(null)
//     setErrors({})
//   }, [])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!validate()) return

//     try {
//       const token = localStorage.getItem('token')
//       const config = { headers: { Authorization: `Bearer ${token}` } }

//       if (editingId) {
//         await axios.put(`http://localhost:3002/api/records/${editingId}`, formData, config)
//         showToast('Record updated successfully', 'success')
//       } else {
//         await axios.post('http://localhost:3002/api/records', formData, config)
//         showToast('Record added successfully', 'success')
//       }

//       resetForm()
//       fetchRecords()
//     } catch (error) {
//       console.error('Error saving record:', error)
//       showToast(error.response?.data?.message || 'Failed to save record', 'danger')
//     }
//   }

//   const handleEdit = (record) => {
//     setFormData({
//       full_Name: record.full_Name || '',
//       email: record.email || '',
//       phone: record.phone || '',
//       gender: record.gender || '',
//       dob: record.dob || '',
//       state_name: record.state_name || '',
//       city: record.city || '',
//       address: record.address || '',
//     })
//     setEditingId(record.id)
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   const handleDelete = async (record) => {
//     if (!window.confirm('Are you sure you want to delete this record?')) return
//     try {
//       const token = localStorage.getItem('token')
//       await axios.delete(`http://localhost:3002/api/records/${record.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       showToast('Record deleted successfully', 'success')
//       fetchRecords()
//     } catch (error) {
//       console.error('Error deleting record:', error)
//       showToast('Failed to delete record', 'danger')
//     }
//   }

//   // -------------------- TABLE & PAGINATION --------------------
//   const handleSort = (field) => {
//     setSortField(field)
//     setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
//   }

//   const handlePageChange = (page) =>
//     setPagination((prev) => ({ ...prev, pageNumber: page }))

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value)
//     setPagination((prev) => ({ ...prev, pageNumber: 1 }))
//   }

//   // -------------------- RENDER --------------------
//   return (
//     <div>
//       {/* Toast Notifications */}
//       <CToaster placement="top-center">
//         {toasts.map((toast) => (
//           <CToast
//             key={toast.id}
//             autohide={true}
//             delay={3000}
//             visible={toast.visible}
//             color={toast.type === 'danger' ? 'danger' : 'primary'}
//             onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
//           >
//             <CToastHeader closeButton>
//               <CIcon
//                 icon={toast.type === 'danger' ? cilXCircle : cilCheckCircle}
//                 className="me-2"
//               />
//               <strong className="me-auto">
//                 {toast.type === 'danger' ? 'Error' : 'Success'}
//               </strong>
//             </CToastHeader>
//             <CToastBody>{toast.message}</CToastBody>
//           </CToast>
//         ))}
//       </CToaster>

//       {/* FORM CARD */}
//       <CCard className="shadow-sm mb-4">
//         <CCardHeader className="bg-dark text-white">
//           <h4 className="mb-0">{editingId ? 'Edit Record' : 'Add New Record'}</h4>
//         </CCardHeader>
//         <CCardBody>
//           <CForm onSubmit={handleSubmit}>
//             <CRow className="g-3">
//               {/* Full Name */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilUser} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     name="full_Name"
//                     placeholder="Full Name *"
//                     value={formData.full_Name}
//                     onChange={handleChange}
//                     invalid={!!errors.full_Name}
//                   />
//                   <CFormFeedback invalid>{errors.full_Name}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Email */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilEnvelopeOpen} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="email"
//                     name="email"
//                     placeholder="Email *"
//                     value={formData.email}
//                     onChange={handleChange}
//                     invalid={!!errors.email}
//                   />
//                   <CFormFeedback invalid>{errors.email}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Phone */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilPhone} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="number"
//                     name="phone"
//                     placeholder="Phone *"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     invalid={!!errors.phone}
//                   />
//                   <CFormFeedback invalid>{errors.phone}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Gender */}
//               <CCol md={4}>
//                 <CFormSelect
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   invalid={!!errors.gender}
//                 >
//                   <option value="">Select Gender *</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </CFormSelect>
//                 {errors.gender && (
//                   <div className="text-danger small mt-1">{errors.gender}</div>
//                 )}
//               </CCol>

//               {/* DOB */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilCalendar} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleChange}
//                     invalid={!!errors.dob}
//                   />
//                   {errors.dob && (
//                     <div className="text-danger small mt-1">{errors.dob}</div>
//                   )}
//                 </CInputGroup>
//               </CCol>

//               {/* State */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilMap} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     name="state_name"
//                     placeholder="State *"
//                     value={formData.state_name}
//                     onChange={handleChange}
//                     invalid={!!errors.state_name}
//                   />
//                   <CFormFeedback invalid>{errors.state_name}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* City */}
//               <CCol md={4}>
//                 <CInputGroup>
//                   <CInputGroupText>
//                     <CIcon icon={cilHome} />
//                   </CInputGroupText>
//                   <CFormInput
//                     type="text"
//                     name="city"
//                     placeholder="City *"
//                     value={formData.city}
//                     onChange={handleChange}
//                     invalid={!!errors.city}
//                   />
//                   <CFormFeedback invalid>{errors.city}</CFormFeedback>
//                 </CInputGroup>
//               </CCol>

//               {/* Address */}
//               <CCol md={12}>
//                 <CFormTextarea
//                   rows={2}
//                   name="address"
//                   placeholder="Address *"
//                   value={formData.address}
//                   onChange={handleChange}
//                   invalid={!!errors.address}
//                 />
//                 <CFormFeedback invalid>{errors.address}</CFormFeedback>
//               </CCol>

//               {/* Submit */}
//               <CCol xs={12} className="text-end mt-3">
//                 <CButton color="primary" type="submit" className="px-4">
//                   {editingId ? 'Update Record' : 'Add Record'}
//                 </CButton>
//                 {editingId && (
//                   <CButton
//                     color="secondary"
//                     type="button"
//                     className="px-4 ms-2"
//                     onClick={resetForm}
//                   >
//                     Cancel
//                   </CButton>
//                 )}
//               </CCol>
//             </CRow>
//           </CForm>
//         </CCardBody>
//       </CCard>

//       {/* TABLE CARD */}
//       <CCard className="shadow-sm">
//         <CCardHeader className="bg-primary text-white">
//           <h4 className="mb-0">Records List</h4>
//         </CCardHeader>
//         <CCardBody>
//           <CInputGroup className="mb-3">
//             <CFormInput
//               type="text"
//               placeholder="Search by name or email"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </CInputGroup>
//           <CTable hover responsive>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell onClick={() => handleSort('id')}>
//                   ID {sortField === 'id' && (sortOrder === 'ASC' ? '↑' : '↓')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell onClick={() => handleSort('full_Name')}>
//                   Full Name {sortField === 'full_Name' && (sortOrder === 'ASC' ? '↑' : '↓')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell onClick={() => handleSort('email')}>
//                   Email {sortField === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell>Phone</CTableHeaderCell>
//                 <CTableHeaderCell>Gender</CTableHeaderCell>
//                 <CTableHeaderCell>DOB</CTableHeaderCell>
//                 <CTableHeaderCell>State</CTableHeaderCell>
//                 <CTableHeaderCell>City</CTableHeaderCell>
//                 <CTableHeaderCell>Address</CTableHeaderCell>
//                 <CTableHeaderCell>Actions</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {records.map((record) => (
//                 <CTableRow key={record.id}>
//                   <CTableDataCell>{record.id}</CTableDataCell>
//                   <CTableDataCell>{record.full_Name}</CTableDataCell>
//                   <CTableDataCell>{record.email}</CTableDataCell>
//                   <CTableDataCell>{record.phone}</CTableDataCell>
//                   <CTableDataCell>{record.gender}</CTableDataCell>
//                   <CTableDataCell>{record.dob}</CTableDataCell>
//                   <CTableDataCell>{record.state_name}</CTableDataCell>
//                   <CTableDataCell>{record.city}</CTableDataCell>
//                   <CTableDataCell>{record.address}</CTableDataCell>
//                   <CTableDataCell>
//                     <CButton
//                       color="info"
//                       size="sm"
//                       className="me-2"
//                       onClick={() => handleEdit(record)}
//                     >
//                       <CIcon icon={cilPencil} />
//                     </CButton>
//                     <CButton
//                       color="danger"
//                       size="sm"
//                       onClick={() => handleDelete(record)}
//                     >
//                       <CIcon icon={cilTrash} />
//                     </CButton>
//                   </CTableDataCell>
//                 </CTableRow>
//               ))}
//             </CTableBody>
//           </CTable>

//           {/* Pagination */}
//           <CPagination align="center" className="mt-3">
//             <CPaginationItem
//               disabled={pagination.pageNumber === 1}
//               onClick={() => handlePageChange(pagination.pageNumber - 1)}
//             >
//               Previous
//             </CPaginationItem>
//             {[...Array(pagination.totalPages).keys()].map((page) => (
//               <CPaginationItem
//                 key={page + 1}
//                 active={page + 1 === pagination.pageNumber}
//                 onClick={() => handlePageChange(page + 1)}
//               >
//                 {page + 1}
//               </CPaginationItem>
//             ))}
//             <CPaginationItem
//               disabled={pagination.pageNumber === pagination.totalPages}
//               onClick={() => handlePageChange(pagination.pageNumber + 1)}
//             >
//               Next
//             </CPaginationItem>
//           </CPagination>
//         </CCardBody>
//       </CCard>
//     </div>
//   )
// }

// export default RecordsTable

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
  CPagination,
  CPaginationItem,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilEnvelopeOpen,
  cilPhone,
  cilCalendar,
  cilHome,
  cilMap,
  cilPencil,
  cilTrash,
  cilCheckCircle,
  cilXCircle,
} from '@coreui/icons'

const RecordsTable = () => {
  // -------------------- STATE --------------------
  const [records, setRecords] = useState([])
  const [formData, setFormData] = useState({
    full_Name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    state_name: '',
    city: '',
    address: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('id')
  const [sortOrder, setSortOrder] = useState('ASC')
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 5,
    totalPages: 0,
    totalRecords: 0,
  })

  const pageSizeOptions = useMemo(() => [5, 8, 10], [])
  const [toasts, setToasts] = useState([])

  // -------------------- TOAST HANDLER --------------------
  const showToast = (message, type = 'success') => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now(), message, type, visible: true },
    ])
  }

  // -------------------- API CALLS --------------------
  const fetchRecords = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('http://localhost:3002/api/records', {
        params: {
          pageSize: pagination.pageSize,
          pageNumber: pagination.pageNumber,
          searchTerm,
          sortField,
          sortOrder,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecords(data.data || [])
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
        totalRecords: data.totalRecords,
      }))
    } catch (error) {
      console.error('Error fetching records:', error)
      showToast('Failed to fetch records', 'danger')
    }
  }, [pagination.pageSize, pagination.pageNumber, searchTerm, sortField, sortOrder])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  // -------------------- VALIDATION --------------------
  const validate = useCallback(() => {
    const newErrors = {}
    const { full_Name, email, phone, gender, dob, state_name, city, address } = formData

    if (!full_Name.trim()) newErrors.full_Name = 'Full Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'

    if (!phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits'

    if (!gender) newErrors.gender = 'Gender is required'
    if (!dob) newErrors.dob = 'Date of Birth is required'
    if (!state_name.trim()) newErrors.state_name = 'State is required'
    if (!city.trim()) newErrors.city = 'City is required'
    if (!address.trim()) newErrors.address = 'Address is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // -------------------- FORM HANDLERS --------------------
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'phone' && value.length > 10) return
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = useCallback(() => {
    setFormData({
      full_Name: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      state_name: '',
      city: '',
      address: '',
    })
    setEditingId(null)
    setErrors({})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      if (editingId) {
        await axios.put(`http://localhost:3002/api/records/${editingId}`, formData, config)
        showToast('Record updated successfully', 'success')
      } else {
        await axios.post('http://localhost:3002/api/records', formData, config)
        showToast('Record added successfully', 'success')
      }

      resetForm()
      fetchRecords()
    } catch (error) {
      console.error('Error saving record:', error)
      showToast(error.response?.data?.message || 'Failed to save record', 'danger')
    }
  }

  const handleEdit = (record) => {
    setFormData({
      full_Name: record.full_Name || '',
      email: record.email || '',
      phone: record.phone || '',
      gender: record.gender || '',
      dob: record.dob || '',
      state_name: record.state_name || '',
      city: record.city || '',
      address: record.address || '',
    })
    setEditingId(record.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (record) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3002/api/records/${record.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      showToast('Record deleted successfully', 'success')
      fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', error)
      showToast('Failed to delete record', 'danger')
    }
  }

  // -------------------- TABLE & PAGINATION --------------------
  const handleSort = (field) => {
    setSortField(field)
    setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
  }

  const handlePageChange = (page) =>
    setPagination((prev) => ({ ...prev, pageNumber: page }))

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setPagination((prev) => ({ ...prev, pageNumber: 1 }))
  }

  // -------------------- EXCEL EXPORT --------------------
  const downloadExcel = () => {
    if (!records || records.length === 0) {
      showToast('No records to export', 'danger')
      return
    }

    const exportData = records.map((record) => ({
      ID: record.id,
      'Full Name': record.full_Name,
      Email: record.email,
      Phone: record.phone,
      Gender: record.gender,
      DOB: record.dob,
      State: record.state_name,
      City: record.city,
      Address: record.address,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Records')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(dataBlob, 'filtered_records.xlsx')

    showToast('Excel file downloaded successfully', 'success')
  }

  // -------------------- RENDER --------------------
  return (
    <div>
      {/* Toast Notifications */}
      <CToaster placement="top-center">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide={true}
            delay={3000}
            visible={toast.visible}
            color={toast.type === 'danger' ? 'danger' : 'primary'}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            <CToastHeader closeButton>
              <CIcon
                icon={toast.type === 'danger' ? cilXCircle : cilCheckCircle}
                className="me-2"
              />
              <strong className="me-auto">
                {toast.type === 'danger' ? 'Error' : 'Success'}
              </strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* FORM CARD */}
      <CCard className="shadow-sm mb-4">
        <CCardHeader className="bg-dark text-white">
          <h4 className="mb-0">{editingId ? 'Edit Record' : 'Add New Record'}</h4>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="g-3">
              {/* Full Name */}
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="full_Name"
                    placeholder="Full Name *"
                    value={formData.full_Name}
                    onChange={handleChange}
                    invalid={!!errors.full_Name}
                  />
                  <CFormFeedback invalid>{errors.full_Name}</CFormFeedback>
                </CInputGroup>
              </CCol>

              {/* Email */}
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilEnvelopeOpen} />
                  </CInputGroupText>
                  <CFormInput
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    invalid={!!errors.email}
                  />
                  <CFormFeedback invalid>{errors.email}</CFormFeedback>
                </CInputGroup>
              </CCol>

              {/* Phone */}
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilPhone} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    name="phone"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={handleChange}
                    invalid={!!errors.phone}
                  />
                  <CFormFeedback invalid>{errors.phone}</CFormFeedback>
                </CInputGroup>
              </CCol>

              {/* Gender */}
              <CCol md={4}>
                <CFormSelect
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  invalid={!!errors.gender}
                >
                  <option value="">Select Gender *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </CFormSelect>
                {errors.gender && (
                  <div className="text-danger small mt-1">{errors.gender}</div>
                )}
              </CCol>

              {/* DOB */}
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilCalendar} />
                  </CInputGroupText>
                  <CFormInput
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    invalid={!!errors.dob}
                  />
                  {errors.dob && (
                    <div className="text-danger small mt-1">{errors.dob}</div>
                  )}
                </CInputGroup>
              </CCol>

              {/* State */}
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilMap} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="state_name"
                    placeholder="State *"
                    value={formData.state_name}
                    onChange={handleChange}
                    invalid={!!errors.state_name}
                  />
                  <CFormFeedback invalid>{errors.state_name}</CFormFeedback>
                </CInputGroup>
              </CCol>

              {/* City */}
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilHome} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleChange}
                    invalid={!!errors.city}
                  />
                  <CFormFeedback invalid>{errors.city}</CFormFeedback>
                </CInputGroup>
              </CCol>

              {/* Address */}
              <CCol md={12}>
                <CFormTextarea
                  rows={2}
                  name="address"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={handleChange}
                  invalid={!!errors.address}
                />
                <CFormFeedback invalid>{errors.address}</CFormFeedback>
              </CCol>

              {/* Submit */}
              <CCol xs={12} className="text-end mt-3">
                <CButton color="primary" type="submit" className="px-4">
                  {editingId ? 'Update Record' : 'Add Record'}
                </CButton>
                {editingId && (
                  <CButton
                    color="secondary"
                    type="button"
                    className="px-4 ms-2"
                    onClick={resetForm}
                  >
                    Cancel
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      {/* TABLE CARD */}
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white">
          <h4 className="mb-0">Records List</h4>
        </CCardHeader>
        <CCardBody>
          {/* Search + Download Button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CInputGroup style={{ maxWidth: '300px' }}>
              <CFormInput
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={handleSearch}
              />
            </CInputGroup>
            <CButton color="success" onClick={downloadExcel}>
              Download Excel
            </CButton>
          </div>

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell onClick={() => handleSort('id')}>
                  ID {sortField === 'id' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => handleSort('full_Name')}>
                  Full Name {sortField === 'full_Name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => handleSort('email')}>
                  Email {sortField === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Gender</CTableHeaderCell>
                <CTableHeaderCell>DOB</CTableHeaderCell>
                <CTableHeaderCell>State</CTableHeaderCell>
                <CTableHeaderCell>City</CTableHeaderCell>
                <CTableHeaderCell>Address</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {records.map((record) => (
                <CTableRow key={record.id}>
                  <CTableDataCell>{record.id}</CTableDataCell>
                  <CTableDataCell>{record.full_Name}</CTableDataCell>
                  <CTableDataCell>{record.email}</CTableDataCell>
                  <CTableDataCell>{record.phone}</CTableDataCell>
                  <CTableDataCell>{record.gender}</CTableDataCell>
                  <CTableDataCell>{record.dob}</CTableDataCell>
                  <CTableDataCell>{record.state_name}</CTableDataCell>
                  <CTableDataCell>{record.city}</CTableDataCell>
                  <CTableDataCell>{record.address}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(record)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(record)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          {/* Pagination */}
          <CPagination align="center" className="mt-3">
            <CPaginationItem
              disabled={pagination.pageNumber === 1}
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
            >
              Previous
            </CPaginationItem>
            {[...Array(pagination.totalPages).keys()].map((page) => (
              <CPaginationItem
                key={page + 1}
                active={page + 1 === pagination.pageNumber}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={pagination.pageNumber === pagination.totalPages}
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
            >
              Next
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default RecordsTable
