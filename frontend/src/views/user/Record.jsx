// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import {
// //   CCard,
// //   CCardBody,
// //   CCardHeader,
// //   CForm,
// //   CFormInput,
// //   CFormSelect,
// //   CFormTextarea,
// //   CRow,
// //   CCol,
// //   CButton,
// //   CImage,
// //   CTable,
// //   CTableHead,
// //   CTableBody,
// //   CTableRow,
// //   CTableHeaderCell,
// //   CTableDataCell,
// //   CFormFeedback,
// //   CInputGroup,
// //   CInputGroupText,
// //   CPagination,
// //   CPaginationItem,
// // } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import {
// //   cilUser,
// //   cilEnvelopeOpen,
// //   cilPhone,
// //   cilCalendar,
// //   cilHome,
// //   cilMap,
// //   cilPencil,
// //   cilTrash,
// // } from '@coreui/icons';

// // const RecordsTable = () => {
// //   const [records, setRecords] = useState([]);
// //   const [formData, setFormData] = useState({
// //     full_Name: '',
// //     email: '',
// //     phone: '',
// //     gender: '',
// //     dob: '',
// //     state_name: '',
// //     city: '',
// //     address: '',
// //     photo: null,
// //   });
// //   const [photoPreview, setPhotoPreview] = useState('');
// //   const [editingId, setEditingId] = useState(null);
// //   const [pagination, setPagination] = useState({
// //     pageNumber: 1,
// //     pageSize: 5,
// //     totalPages: 0,
// //     totalRecords: 0,
// //   });
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [sortField, setSortField] = useState('id');
// //   const [sortOrder, setSortOrder] = useState('ASC');
// //   const [errors, setErrors] = useState({});

// //   useEffect(() => {
// //     fetchRecords();
// //   }, [pagination.pageNumber, searchTerm, sortField, sortOrder]);

// //   const fetchRecords = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await axios.get('http://localhost:3002/api/records', {
// //         params: {
// //           pageSize: pagination.pageSize,
// //           pageNumber: pagination.pageNumber,
// //           searchTerm,
// //           sortField,
// //           sortOrder,
// //         },
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setRecords(response.data.data);
// //       setPagination((prev) => ({
// //         ...prev,
// //         totalPages: response.data.totalPages,
// //         totalRecords: response.data.totalRecords,
// //       }));
// //     } catch (error) {
// //       console.error('Error fetching records:', error);
// //     }
// //   };

// //   const validate = () => {
// //     const newErrors = {};
// //     if (!formData.full_Name.trim()) newErrors.full_Name = 'Full Name is required';
// //     if (!formData.email.trim()) newErrors.email = 'Email is required';
// //     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
// //     if (formData.phone && !/^\d{0,10}$/.test(formData.phone))
// //       newErrors.phone = 'Phone must be up to 10 digits';
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     if (name === 'phone' && value.length > 10) return;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handlePhotoChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setFormData({ ...formData, photo: file });
// //       const reader = new FileReader();
// //       reader.onload = (event) => {
// //         setPhotoPreview(event.target.result);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validate()) return;

// //     try {
// //       const formDataToSend = new FormData();
// //       formDataToSend.append('full_Name', formData.full_Name);
// //       formDataToSend.append('email', formData.email);
// //       formDataToSend.append('phone', formData.phone);
// //       formDataToSend.append('gender', formData.gender);
// //       formDataToSend.append('dob', formData.dob);
// //       formDataToSend.append('state_name', formData.state_name);
// //       formDataToSend.append('city', formData.city);
// //       formDataToSend.append('address', formData.address);
// //       if (formData.photo instanceof File) {
// //         formDataToSend.append('photo', formData.photo);
// //       }

// //       const token = localStorage.getItem('token');

// //       if (editingId) {
// //         await axios.put(`http://localhost:3002/api/records/${editingId}`, formDataToSend, {
// //           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
// //         });
// //       } else {
// //         await axios.post(`http://localhost:3002/api/records`, formDataToSend, {
// //           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
// //         });
// //       }

// //       setFormData({
// //         full_Name: '',
// //         email: '',
// //         phone: '',
// //         gender: '',
// //         dob: '',
// //         state_name: '',
// //         city: '',
// //         address: '',
// //         photo: null,
// //       });
// //       setPhotoPreview('');
// //       setEditingId(null);
// //       setErrors({});
// //       fetchRecords();
// //     } catch (error) {
// //       console.error('Error saving record:', error);
// //       alert(error.response?.data?.message || 'Failed to save record');
// //     }
// //   };

// //   const handleEdit = (record) => {
// //     setFormData({
// //       full_Name: record.full_Name,
// //       email: record.email,
// //       phone: record.phone || '',
// //       gender: record.gender || '',
// //       dob: record.dob || '',
// //       state_name: record.state_name || '',
// //       city: record.city || '',
// //       address: record.address || '',
// //       photo: null,
// //     });
// //     setPhotoPreview(record.photo || '');
// //     setEditingId(record.id);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const handleDelete = async (record) => {
// //     if (!window.confirm('Are you sure you want to delete this record?')) return;
// //     try {
// //       const token = localStorage.getItem('token');
// //       await axios.delete(`http://localhost:3002/api/records/${record.id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       fetchRecords();
// //     } catch (error) {
// //       console.error('Error deleting record:', error);
// //     }
// //   };

// //   const handlePageChange = (page) => setPagination((prev) => ({ ...prev, pageNumber: page }));
// //   const handleSort = (field) => {
// //     setSortField(field);
// //     setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
// //   };
// //   const handleSearch = (e) => {
// //     setSearchTerm(e.target.value);
// //     setPagination((prev) => ({ ...prev, pageNumber: 1 }));
// //   };

// //   return (
// //     <div>
// //       {/* --- FORM CARD --- */}
// //       <CCard className="shadow-sm mb-4">
// //         <CCardHeader className="bg-gradient-primary text-white">
// //           <h4 className="mb-0">{editingId ? 'Edit Record' : 'Add New Record'}</h4>
// //         </CCardHeader>
// //         <CCardBody>
// //           <CForm onSubmit={handleSubmit}>
// //             <CRow className="g-3">
// //               {/* Full Name */}
// //               <CCol md={4}>
// //                 <CInputGroup>
// //                   <CInputGroupText>
// //                     <CIcon icon={cilUser} />
// //                   </CInputGroupText>
// //                   <CFormInput
// //                     type="text"
// //                     placeholder="Full Name"
// //                     name="full_Name"
// //                     value={formData.full_Name}
// //                     onChange={handleChange}
// //                     invalid={!!errors.full_Name}
// //                   />
// //                   <CFormFeedback invalid>{errors.full_Name}</CFormFeedback>
// //                 </CInputGroup>
// //               </CCol>

// //               {/* Email */}
// //               <CCol md={4}>
// //                 <CInputGroup>
// //                   <CInputGroupText>
// //                     <CIcon icon={cilEnvelopeOpen} />
// //                   </CInputGroupText>
// //                   <CFormInput
// //                     type="email"
// //                     placeholder="Email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     invalid={!!errors.email}
// //                   />
// //                   <CFormFeedback invalid>{errors.email}</CFormFeedback>
// //                 </CInputGroup>
// //               </CCol>

// //               {/* Phone */}
// //               <CCol md={4}>
// //                 <CInputGroup>
// //                   <CInputGroupText>
// //                     <CIcon icon={cilPhone} />
// //                   </CInputGroupText>
// //                   <CFormInput
// //                     type="number"
// //                     placeholder="Phone"
// //                     name="phone"
// //                     value={formData.phone}
// //                     onChange={handleChange}
// //                     invalid={!!errors.phone}
// //                   />
// //                   <CFormFeedback invalid>{errors.phone}</CFormFeedback>
// //                 </CInputGroup>
// //               </CCol>

// //               {/* Gender */}
// //               <CCol md={4}>
// //                 <CFormSelect name="gender" value={formData.gender} onChange={handleChange}>
// //                   <option value="">Select Gender</option>
// //                   <option value="Male">Male</option>
// //                   <option value="Female">Female</option>
// //                   <option value="Other">Other</option>
// //                 </CFormSelect>
// //               </CCol>

// //               {/* DOB */}
// //               <CCol md={4}>
// //                 <CInputGroup>
// //                   <CInputGroupText>
// //                     <CIcon icon={cilCalendar} />
// //                   </CInputGroupText>
// //                   <CFormInput type="date" name="dob" value={formData.dob} onChange={handleChange} />
// //                 </CInputGroup>
// //               </CCol>

// //               {/* State */}
// //               <CCol md={4}>
// //                 <CInputGroup>
// //                   <CInputGroupText>
// //                     <CIcon icon={cilMap} />
// //                   </CInputGroupText>
// //                   <CFormInput type="text" placeholder="State" name="state_name" value={formData.state_name} onChange={handleChange} />
// //                 </CInputGroup>
// //               </CCol>

// //               {/* City */}
// //               <CCol md={4}>
// //                 <CInputGroup>
// //                   <CInputGroupText>
// //                     <CIcon icon={cilHome} />
// //                   </CInputGroupText>
// //                   <CFormInput type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
// //                 </CInputGroup>
// //               </CCol>

// //               {/* Address */}
// //               <CCol md={12}>
// //                 <CFormTextarea
// //                   rows={2}
// //                   placeholder="Address"
// //                   name="address"
// //                   value={formData.address}
// //                   onChange={handleChange}
// //                 />
// //               </CCol>

// //               {/* Photo */}
// //               <CCol md={4}>
// //                 <CFormInput type="file" label="Photo" accept="image/*" onChange={handlePhotoChange} />
// //                 {photoPreview && (
// //                   <div className="mt-2 text-center">
// //                     <CImage rounded thumbnail src={photoPreview} width={100} height={100} alt="Preview" />
// //                   </div>
// //                 )}
// //               </CCol>

// //               {/* Submit */}
// //               <CCol xs={12} className="text-end mt-3">
// //                 <CButton color="primary" type="submit" className="px-4">
// //                   {editingId ? 'Update Record' : 'Add Record'}
// //                 </CButton>
// //               </CCol>
// //             </CRow>
// //           </CForm>
// //         </CCardBody>
// //       </CCard>

// //       {/* --- TABLE CARD --- */}
// //       <CCard className="shadow-sm">
// //         <CCardHeader className="bg-gradient-primary text-white">
// //           <h4 className="mb-0">Records List</h4>
// //         </CCardHeader>
// //         <CCardBody>
// //           <CInputGroup className="mb-3">
// //             <CFormInput
// //               type="text"
// //               placeholder="Search by name or email"
// //               value={searchTerm}
// //               onChange={handleSearch}
// //             />
// //           </CInputGroup>
// //           <CTable hover responsive>
// //             <CTableHead>
// //               <CTableRow>
// //                 <CTableHeaderCell onClick={() => handleSort('id')}>
// //                   ID {sortField === 'id' && (sortOrder === 'ASC' ? '↑' : '↓')}
// //                 </CTableHeaderCell>
// //                 <CTableHeaderCell onClick={() => handleSort('full_Name')}>
// //                   Full Name {sortField === 'full_Name' && (sortOrder === 'ASC' ? '↑' : '↓')}
// //                 </CTableHeaderCell>
// //                 <CTableHeaderCell onClick={() => handleSort('email')}>
// //                   Email {sortField === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
// //                 </CTableHeaderCell>
// //                 <CTableHeaderCell>Phone</CTableHeaderCell>
// //                 <CTableHeaderCell>Gender</CTableHeaderCell>
// //                 <CTableHeaderCell>DOB</CTableHeaderCell>
// //                 <CTableHeaderCell>State</CTableHeaderCell>
// //                 <CTableHeaderCell>City</CTableHeaderCell>
// //                 <CTableHeaderCell>Address</CTableHeaderCell>
// //                 <CTableHeaderCell>Photo</CTableHeaderCell>
// //                 <CTableHeaderCell>Actions</CTableHeaderCell>
// //               </CTableRow>
// //             </CTableHead>
// //             <CTableBody>
// //               {records.map((record) => (
// //                 <CTableRow key={record.id}>
// //                   <CTableDataCell>{record.id}</CTableDataCell>
// //                   <CTableDataCell>{record.full_Name}</CTableDataCell>
// //                   <CTableDataCell>{record.email}</CTableDataCell>
// //                   <CTableDataCell>{record.phone}</CTableDataCell>
// //                   <CTableDataCell>{record.gender}</CTableDataCell>
// //                   <CTableDataCell>{record.dob}</CTableDataCell>
// //                   <CTableDataCell>{record.state_name}</CTableDataCell>
// //                   <CTableDataCell>{record.city}</CTableDataCell>
// //                   <CTableDataCell>{record.address}</CTableDataCell>
// //                   <CTableDataCell>
// //                     {record.photo && (
// //                       <CImage rounded thumbnail src={`http://localhost:3002${record.photo}`} width={50} height={50} alt="User" />
// //                     )}
// //                   </CTableDataCell>
// //                   <CTableDataCell>
// //                     <CButton color="info" size="sm" className="me-2" onClick={() => handleEdit(record)}>
// //                       <CIcon icon={cilPencil} />
// //                     </CButton>
// //                     <CButton color="danger" size="sm" onClick={() => handleDelete(record)}>
// //                       <CIcon icon={cilTrash} />
// //                     </CButton>
// //                   </CTableDataCell>
// //                 </CTableRow>
// //               ))}
// //             </CTableBody>
// //           </CTable>

// //           {/* Pagination */}
// //           <CPagination align="center" className="mt-3">
// //             <CPaginationItem
// //               disabled={pagination.pageNumber === 1}
// //               onClick={() => handlePageChange(pagination.pageNumber - 1)}
// //             >
// //               Previous
// //             </CPaginationItem>
// //             {[...Array(pagination.totalPages).keys()].map((page) => (
// //               <CPaginationItem
// //                 key={page + 1}
// //                 active={page + 1 === pagination.pageNumber}
// //                 onClick={() => handlePageChange(page + 1)}
// //               >
// //                 {page + 1}
// //               </CPaginationItem>
// //             ))}
// //             <CPaginationItem
// //               disabled={pagination.pageNumber === pagination.totalPages}
// //               onClick={() => handlePageChange(pagination.pageNumber + 1)}
// //             >
// //               Next
// //             </CPaginationItem>
// //           </CPagination>
// //         </CCardBody>
// //       </CCard>
// //     </div>
// //   );
// // };

// // export default RecordsTable;
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
//   CImage,
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
//     photo: null,
//   });
//   const [photoPreview, setPhotoPreview] = useState('');
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

//   // ---- Validation for all mandatory fields ----
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
//     if (!formData.photo && !editingId) newErrors.photo = 'Photo is required'; // Only required when adding new
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'phone' && value.length > 10) return;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, photo: file });
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setPhotoPreview(event.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('full_Name', formData.full_Name);
//       formDataToSend.append('email', formData.email);
//       formDataToSend.append('phone', formData.phone);
//       formDataToSend.append('gender', formData.gender);
//       formDataToSend.append('dob', formData.dob);
//       formDataToSend.append('state_name', formData.state_name);
//       formDataToSend.append('city', formData.city);
//       formDataToSend.append('address', formData.address);
//       if (formData.photo instanceof File) {
//         formDataToSend.append('photo', formData.photo);
//       }

//       const token = localStorage.getItem('token');

//       if (editingId) {
//         await axios.put(`http://localhost:3002/api/records/${editingId}`, formDataToSend, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         await axios.post(`http://localhost:3002/api/records`, formDataToSend, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//         });
//       }

//       // Reset form
//       setFormData({
//         full_Name: '',
//         email: '',
//         phone: '',
//         gender: '',
//         dob: '',
//         state_name: '',
//         city: '',
//         address: '',
//         photo: null,
//       });
//       setPhotoPreview('');
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
//       photo: null,
//     });
//     setPhotoPreview(record.photo ? `http://localhost:3002${record.photo}` : '');
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
//         <CCardHeader style={{ backgroundColor: '#755c59ff', color: 'white' }}> {/* Red background */}
//     <h4 className="mb-0">{editingId ? 'Edit Record' : 'Add New Record'}</h4>
//   </CCardHeader>
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

//               {/* Photo */}
//               <CCol md={4}>
//                 <CFormInput
//                   type="file"
//                   label="Photo *"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   invalid={!!errors.photo}
//                 />
//                 <CFormFeedback invalid>{errors.photo}</CFormFeedback>
//                 {photoPreview && (
//                   <div className="mt-2 text-center">
//                     <CImage
//                       rounded
//                       thumbnail
//                       src={photoPreview.startsWith('http') ? photoPreview : `http://localhost:3002${photoPreview}`}
//                       width={100}
//                       height={100}
//                       alt="Preview"
//                     />
//                   </div>
//                 )}
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
//         <CCardHeader style={{ backgroundColor: '#3498db', color: 'white' }}> {/* Blue background */}
//     <h4 className="mb-0">Records List</h4>
//   </CCardHeader>
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
//                 <CTableHeaderCell>Photo</CTableHeaderCell>
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
//                     {record.photo && (
//                       <CImage
//                         rounded
//                         thumbnail
//                         src={`http://localhost:3002${record.photo}`}
//                         width={50}
//                         height={50}
//                         alt="User"
//                       />
//                     )}
//                   </CTableDataCell>
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilEnvelopeOpen,
  cilPhone,
  cilCalendar,
  cilHome,
  cilMap,
  cilPencil,
  cilTrash,
} from '@coreui/icons';

const RecordsTable = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    full_Name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    state_name: '',
    city: '',
    address: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 5,
    totalPages: 0,
    totalRecords: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [errors, setErrors] = useState({});
  const pageSizeOptions = [5, 8, 10];

  useEffect(() => {
    fetchRecords();
  }, [pagination.pageNumber, searchTerm, sortField, sortOrder]);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3002/api/records', {
        params: {
          pageSize: pagination.pageSize,
          pageNumber: pagination.pageNumber,
          searchTerm,
          sortField,
          sortOrder,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(response.data.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalRecords: response.data.totalRecords,
      }));
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_Name.trim()) newErrors.full_Name = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.state_name.trim()) newErrors.state_name = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && value.length > 10) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');

      if (editingId) {
        await axios.put(`http://localhost:3002/api/records/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:3002/api/records`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({
        full_Name: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        state_name: '',
        city: '',
        address: '',
      });
      setEditingId(null);
      setErrors({});
      fetchRecords();
    } catch (error) {
      console.error('Error saving record:', error);
      alert(error.response?.data?.message || 'Failed to save record');
    }
  };

  const handleEdit = (record) => {
    setFormData({
      full_Name: record.full_Name,
      email: record.email,
      phone: record.phone || '',
      gender: record.gender || '',
      dob: record.dob || '',
      state_name: record.state_name || '',
      city: record.city || '',
      address: record.address || '',
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (record) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3002/api/records/${record.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handlePageChange = (page) => setPagination((prev) => ({ ...prev, pageNumber: page }));
  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  return (
    <div>
      {/* FORM CARD */}
      <CCard className="shadow-sm mb-4">
        <CCardHeader style={{ backgroundColor: '#755c59ff', color: 'white' }}>
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
                    placeholder="Full Name *"
                    name="full_Name"
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
                    placeholder="Email *"
                    name="email"
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
                    placeholder="Phone *"
                    name="phone"
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
                {errors.gender && <span style={{ color: 'red', fontSize: '12px' }}>{errors.gender}</span>}
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
                  {errors.dob && <span style={{ color: 'red', fontSize: '12px' }}>{errors.dob}</span>}
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
                    placeholder="State *"
                    name="state_name"
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
                    placeholder="City *"
                    name="city"
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
                  placeholder="Address *"
                  name="address"
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
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      {/* TABLE CARD */}
      <CCard className="shadow-sm">
        <CCardHeader style={{ backgroundColor: '#3498db', color: 'white' }}>
          <h4 className="mb-0">Records List</h4>
        </CCardHeader>
        <CCardBody>
          <CInputGroup className="mb-3">
            <CFormInput
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearch}
            />
          </CInputGroup>
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
                    <CButton color="info" size="sm" className="me-2" onClick={() => handleEdit(record)}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="danger" size="sm" onClick={() => handleDelete(record)}>
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
  );
};

export default RecordsTable;
