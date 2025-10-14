import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormFeedback,
  CPagination,
  CPaginationItem,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
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
  cilCheckCircle,
  cilXCircle,
  cilCloudDownload,
  cilPlus,
  cilCloudUpload,
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
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('full_Name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 5,
    totalPages: 0,
    totalRecords: 0,
  });
  const [toasts, setToasts] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormat, setUploadFormat] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pageSizeOptions = useMemo(() => [5, 8, 10], []);

  // -------------------- WebSocket --------------------
  const wsUrl = 'ws://localhost:3002';
  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    const mapRecord = (r) => ({
      id: r.id,
      full_Name: r.full_Name || r.fullName || '',
      email: r.email || '',
      phone: r.phone || '',
      gender: r.gender || '',
      dob: r.dob || '',
      state_name: r.state_name || '',
      city: r.city || '',
      address: r.address || r.street || '',
    });

    ws.onopen = () => console.log('Connected to WebSocket server');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'init':
          setRecords(message.data.map(mapRecord));
          break;
        case 'insert':
          setRecords((prev) => [...prev, mapRecord(message.data)]);
          break;
        case 'update':
          setRecords((prev) =>
            prev.map((r) => (r.id === message.data.id ? mapRecord(message.data) : r))
          );
          break;
        case 'delete':
          setRecords((prev) => prev.filter((r) => r.id !== message.data.id));
          break;
        default:
          break;
      }
    };
    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket connection closed');
    return () => ws.close();
  }, []);

  // -------------------- Toast --------------------
  const showToast = (message, type = 'success') => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type, visible: true }]);
  };

  // -------------------- Fetch Records --------------------
  const fetchRecords = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:3002/api/records', {
        params: {
          pageSize: pagination.pageSize,
          pageNumber: pagination.pageNumber,
          searchTerm,
          sortField,
          sortOrder,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(
        data.data.map((r) => ({
          id: r.id,
          full_Name: r.full_Name,
          email: r.email,
          phone: r.phone,
          gender: r.gender,
          dob: r.dob,
          state_name: r.state_name,
          city: r.city,
          address: r.address,
        }))
      );
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
        totalRecords: data.totalRecords,
      }));
    } catch (error) {
      console.error('Error fetching records:', error);
      showToast('Failed to fetch records', 'danger');
    }
  }, [pagination.pageSize, pagination.pageNumber, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // -------------------- Validation --------------------
  const validate = useCallback(() => {
    const newErrors = {};
    const { full_Name, email, phone, gender, dob, state_name, city, address } = formData;
    if (!full_Name.trim()) newErrors.full_Name = 'Full Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid Email';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!dob) newErrors.dob = 'DOB is required';
    if (!state_name.trim()) newErrors.state_name = 'State is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // -------------------- Form Handlers --------------------
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (typeof value === 'string') value = value.trimStart();
    if (name === 'phone' && value.length > 10) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    });
    setEditingId(null);
    setErrors({});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`http://localhost:3002/api/records/${editingId}`, formData, config);
        showToast('Record updated successfully');
      } else {
        await axios.post('http://localhost:3002/api/records', formData, config);
        showToast('Record added successfully');
      }
      resetForm();
      setVisible(false);
      fetchRecords();
    } catch (error) {
      console.error('Error saving record:', error);
      showToast(error.response?.data?.message || 'Failed to save record', 'danger');
    }
  };

  const handleEdit = (record) => {
    setFormData({ ...record });
    setEditingId(record.id);
    setVisible(true);
  };

  const handleDelete = async (record) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3002/api/records/${record.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Record deleted successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      showToast('Failed to delete record', 'danger');
    }
  };

  // -------------------- Sorting & Pagination --------------------
  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };

  const handlePageChange = (page) => setPagination((prev) => ({ ...prev, pageNumber: page }));
  const handleNext = () => {
    if (pagination.pageNumber < pagination.totalPages) {
      handlePageChange(pagination.pageNumber + 1);
    }
  };
  const handlePrev = () => {
    if (pagination.pageNumber > 1) {
      handlePageChange(pagination.pageNumber - 1);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  // -------------------- Excel Export --------------------
  const downloadExcel = async () => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem('token');
      let allRecords = [];
      let pageNumber = 1;
      const pageSize = 100;
      let totalPages = 1;
      do {
        const { data } = await axios.get('http://localhost:3002/api/records', {
          params: { pageSize, pageNumber, searchTerm, sortField, sortOrder },
          headers: { Authorization: `Bearer ${token}` },
        });
        allRecords = allRecords.concat(data.data || []);
        totalPages = data.totalPages || 1;
        pageNumber++;
      } while (pageNumber <= totalPages);

      if (!allRecords.length) {
        showToast('No records to export', 'danger');
        return;
      }

      const exportData = allRecords.map((r) => ({
        'Full Name': r.full_Name,
        Email: r.email,
        Phone: r.phone,
        Gender: r.gender,
        DOB: r.dob,
        State: r.state_name,
        City: r.city,
        Address: r.address,
      }));

      // Calculate column widths
      const colWidths = exportData.reduce((acc, row) => {
        Object.keys(row).forEach((key, i) => {
          const value = String(row[key] || '');
          acc[i] = Math.max(acc[i] || key.length, value.length);
        });
        return acc;
      }, []);

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet['!cols'] = colWidths.map((w) => ({ wch: Math.min(Math.max(w, 10), 50) }));

      // Apply bold style and borders to headers
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
        };
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Records');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(dataBlob, 'records.xlsx');
      showToast('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      showToast('Failed to download Excel', 'danger');
    } finally {
      setIsExporting(false);
    }
  };

  // -------------------- Upload Handler --------------------
  const handleUploadClick = async () => {
    if (!selectedFile) {
      showToast('Please select a file before uploading', 'danger');
      return;
    }
    if (uploadFormat !== 'excel') {
      showToast('Only Excel format is supported', 'danger');
      return;
    }

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const mappedData = jsonData.map((row) => ({
          full_Name: row['Full Name'] || row['full_Name'] || row['Name'] || '',
          email: row['Email'] || '',
          phone: String(row['Phone'] || '').replace(/\D/g, '').slice(0, 10),
          gender: row['Gender'] || '',
          dob: row['DOB'] || '',
          state_name: row['State'] || '',
          city: row['City'] || '',
          address: row['Address'] || '',
        }));

        const existingEmails = records.map((r) => r.email.toLowerCase());
        const newRecords = mappedData.filter(
          (r) => r.email && !existingEmails.includes(r.email.toLowerCase())
        );

        if (newRecords.length === 0) {
          showToast('No new records to add', 'info');
          return;
        }

        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3002/api/records/bulk-insert', newRecords, {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchRecords();
        showToast(`${newRecords.length} new record(s) added successfully!`);
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadFormat('');
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to process file', 'danger');
    } finally {
      setUploading(false);
    }
  };

  // -------------------- Modal Handlers --------------------
  const openAddModal = () => {
    resetForm();
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
    resetForm();
  };

  // -------------------- Render --------------------
  return (
    <div className="container mx-auto p-4">
      {/* Toasts */}
      <CToaster placement="top-end">
        {toasts.map((toast) => (
          <CToast
            key={toast.id}
            autohide
            delay={3000}
            visible={toast.visible}
            color={toast.type === 'danger' ? 'danger' : toast.type === 'info' ? 'info' : 'primary'}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="shadow-lg"
          >
            <CToastHeader closeButton>
              <CIcon icon={toast.type === 'danger' ? cilXCircle : cilCheckCircle} className="me-2" />
              <strong className="me-auto">
                {toast.type === 'danger' ? 'Error' : toast.type === 'info' ? 'Info' : 'Success'}
              </strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>

      {/* Table Card */}
      <CCard className="shadow-lg border-0">
        <CCardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white d-flex justify-content-between align-items-center">
         <h4 className="mb-0 font-semibold" style={{ color: 'red' }}>Records Management</h4>
          <div className="d-flex gap-2">
            <CButton color="light" onClick={openAddModal} className="font-medium">
              <CIcon icon={cilPlus} className="me-1" /> Add Record
            </CButton>
            <CButton color="success" onClick={downloadExcel} className="font-medium">
              {isExporting ? (
                <CSpinner size="sm" className="me-1" />
              ) : (
                <CIcon icon={cilCloudDownload} className="me-1" />
              )}
              Export Excel
            </CButton>
            <CButton color="warning" onClick={() => setShowUploadModal(true)} className="font-medium">
              <CIcon icon={cilCloudUpload} className="me-1" /> Upload File
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody className="bg-white">
          <CInputGroup className="mb-4" style={{ maxWidth: '400px' }}>
            <CInputGroupText className="bg-gray-100">
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearch}
              className="border-gray-300 focus:ring-blue-500"
            />
          </CInputGroup>

          {/* Table */}
          <CTable hover responsive bordered className="table-auto">
            <CTableHead color="light">
              <CTableRow>
                {['full_Name', 'email', 'phone', 'gender', 'dob', 'state_name', 'city', 'address'].map(
                  (field, idx) => (
                    <CTableHeaderCell
                      key={idx}
                      onClick={() =>
                        field !== 'phone' &&
                        field !== 'gender' &&
                        field !== 'dob' &&
                        field !== 'state_name' &&
                        field !== 'city' &&
                        field !== 'address' &&
                        handleSort(field)
                      }
                      className="cursor-pointer font-semibold text-gray-700"
                    >
                      {field === 'full_Name'
                        ? 'Full Name'
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field && (sortOrder === 'ASC' ? ' ↑' : ' ↓')}
                    </CTableHeaderCell>
                  )
                )}
                <CTableHeaderCell className="font-semibold text-gray-700">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {records.map((r) => (
                <CTableRow key={r.id} className="hover:bg-gray-50">
                  <CTableDataCell>{r.full_Name}</CTableDataCell>
                  <CTableDataCell>{r.email}</CTableDataCell>
                  <CTableDataCell>{r.phone}</CTableDataCell>
                  <CTableDataCell>{r.gender}</CTableDataCell>
                  <CTableDataCell>{r.dob}</CTableDataCell>
                  <CTableDataCell>{r.state_name}</CTableDataCell>
                  <CTableDataCell>{r.city}</CTableDataCell>
                  <CTableDataCell>{r.address}</CTableDataCell>
                  <CTableDataCell className="d-flex gap-2">
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => handleEdit(r)}
                      className="hover:bg-blue-600"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(r)}
                      className="hover:bg-red-600"
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

         {/* Pagination */}
{/* Pagination */}
<div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
  {/* Page Size Selector */}
  <CFormSelect
    value={pagination.pageSize}
    onChange={(e) =>
      setPagination((prev) => ({
        ...prev,
        pageSize: Number(e.target.value),
        pageNumber: 1,
      }))
    }
    className="text-sm px-3 py-1.5 border border-gray-300 rounded w-auto"
    style={{ minWidth: '3rem' }} // slightly wider for readability
  >
    {pageSizeOptions.map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ))}
  </CFormSelect>

  {/* Pagination Controls */}
  <div className="d-flex align-items-center gap-2">
    <CButton
      color="light"
      size="sm"
      disabled={pagination.pageNumber === 1}
      onClick={handlePrev}
      className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100"
    >
      Prev
    </CButton>

    <CPagination align="center" className="m-0">
      {[...Array(pagination.totalPages).keys()].map((i) => (
        <CPaginationItem
          key={i + 1}
          active={i + 1 === pagination.pageNumber}
          onClick={() => handlePageChange(i + 1)}
          className={`text-sm px-3 py-1.5 rounded ${
            i + 1 === pagination.pageNumber
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border border-gray-300 hover:bg-blue-50 text-gray-700'
          }`}
          style={{ minWidth: '2.5rem' }}
        >
          {i + 1}
        </CPaginationItem>
      ))}
    </CPagination>

    <CButton
      color="light"
      size="sm"
      disabled={pagination.pageNumber === pagination.totalPages}
      onClick={handleNext}
      className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100"
    >
      Next
    </CButton>
  </div>

  {/* Records Info */}
  <div className="text-sm text-gray-600">
    {records.length > 0
      ? `Showing ${(pagination.pageNumber - 1) * pagination.pageSize + 1} to ${
          (pagination.pageNumber - 1) * pagination.pageSize + records.length
        } of ${pagination.totalRecords}`
      : 'No records found'}
  </div>
</div>


        </CCardBody>
      </CCard>

      {/* Add/Edit Modal */}
      <CModal visible={visible} onClose={closeModal} size="lg" className="shadow-xl">
        <CModalHeader closeButton className="bg-blue-50">
          <CModalTitle className="text-lg font-semibold">
            {editingId ? 'Edit Record' : 'Add New Record'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-gray-50 p-6">
          <CForm onSubmit={handleSubmit}>
            <CInputGroup className="mb-4">
              <CInputGroupText className="bg-gray-100">
                <CIcon icon={cilUser} />
              </CInputGroupText>
              <CFormInput
                type="text"
                name="full_Name"
                placeholder="Full Name *"
                value={formData.full_Name}
                onChange={handleChange}
                invalid={!!errors.full_Name}
                className="border-gray-300 focus:ring-blue-500"
              />
              <CFormFeedback invalid>{errors.full_Name}</CFormFeedback>
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText className="bg-gray-100">
                <CIcon icon={cilEnvelopeOpen} />
              </CInputGroupText>
              <CFormInput
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                invalid={!!errors.email}
                className="border-gray-300 focus:ring-blue-500"
              />
              <CFormFeedback invalid>{errors.email}</CFormFeedback>
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText className="bg-gray-100">
                <CIcon icon={cilPhone} />
              </CInputGroupText>
              <CFormInput
                type="number"
                name="phone"
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                invalid={!!errors.phone}
                className="border-gray-300 focus:ring-blue-500"
              />
              <CFormFeedback invalid>{errors.phone}</CFormFeedback>
            </CInputGroup>
            <CFormSelect
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              invalid={!!errors.gender}
              className="mb-4 border-gray-300 focus:ring-blue-500"
            >
              <option value="">Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </CFormSelect>
            {errors.gender && <div className="text-danger small mb-4">{errors.gender}</div>}
            <CInputGroup className="mb-4">
              <CInputGroupText className="bg-gray-100">
                <CIcon icon={cilCalendar} />
              </CInputGroupText>
              <CFormInput
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                invalid={!!errors.dob}
                className="border-gray-300 focus:ring-blue-500"
              />
              {errors.dob && <div className="text-danger small mb-4">{errors.dob}</div>}
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText className="bg-gray-100">
                <CIcon icon={cilMap} />
              </CInputGroupText>
              <CFormInput
                type="text"
                name="state_name"
                placeholder="State *"
                value={formData.state_name}
                onChange={handleChange}
                invalid={!!errors.state_name}
                className="border-gray-300 focus:ring-blue-500"
              />
              <CFormFeedback invalid>{errors.state_name}</CFormFeedback>
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText className="bg-gray-100">
                <CIcon icon={cilHome} />
              </CInputGroupText>
              <CFormInput
                type="text"
                name="city"
                placeholder="City *"
                value={formData.city}
                onChange={handleChange}
                invalid={!!errors.city}
                className="border-gray-300 focus:ring-blue-500"
              />
              <CFormFeedback invalid>{errors.city}</CFormFeedback>
            </CInputGroup>
            <CFormTextarea
              rows={3}
              name="address"
              placeholder="Address *"
              value={formData.address}
              onChange={handleChange}
              invalid={!!errors.address}
              className="mb-4 border-gray-300 focus:ring-blue-500"
            />
            <CFormFeedback invalid>{errors.address}</CFormFeedback>
          </CForm>
        </CModalBody>
        <CModalFooter className="bg-gray-50">
          <CButton color="secondary" onClick={closeModal} className="hover:bg-gray-200">
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit} className="hover:bg-blue-600">
            {editingId ? 'Update Record' : 'Add Record'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Upload Modal */}
      <CModal visible={showUploadModal} onClose={() => setShowUploadModal(false)} className="shadow-xl">
        <CModalHeader closeButton className="bg-blue-50">
          <CModalTitle className="text-lg font-semibold">Upload Records File</CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-gray-50 p-6">
          <CFormSelect
            label="Select Format"
            value={uploadFormat}
            onChange={(e) => setUploadFormat(e.target.value)}
            className="mb-4 border-gray-300 focus:ring-blue-500"
          >
            <option value="">-- Select Format --</option>
            <option value="excel">Excel (.xlsx, .xls)</option>
          </CFormSelect>
          <CFormInput
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            disabled={!uploadFormat || uploading}
            className="border-gray-300 focus:ring-blue-500"
          />
          {uploading && (
            <div className="text-center mt-4">
              <CSpinner size="sm" className="me-2" /> Uploading...
            </div>
          )}
        </CModalBody>
        <CModalFooter className="bg-gray-50">
          <CButton color="secondary" onClick={() => setShowUploadModal(false)} className="hover:bg-gray-200">
            Close
          </CButton>
          <CButton
            color="primary"
            disabled={!uploadFormat || !selectedFile || uploading}
            onClick={handleUploadClick}
            className="hover:bg-blue-600"
          >
            {uploading ? (
              <>
                <CSpinner size="sm" className="me-2" /> Uploading...
              </>
            ) : (
              <>
                <CIcon icon={cilCloudUpload} className="me-2" /> Upload
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default RecordsTable;