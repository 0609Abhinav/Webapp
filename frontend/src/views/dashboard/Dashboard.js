
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CRow,
  CCol,
  CProgress,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilUserFemale,
  cilPencil,
  cilTrash,
  cilArrowTop,
  cilArrowBottom,
  cilCloudDownload,
} from '@coreui/icons';
import WidgetsDropdown from '../widgets/WidgetsDropdown';
import WidgetsBrand from '../widgets/WidgetsBrand';
import MainChart from './MainChart'; // your chart component

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const apiBase = 'http://localhost:3002/api';
  const baseUploadUrl = 'http://localhost:3002/uploads/';

  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [deleteModal, setDeleteModal] = useState({ visible: false, userId: null });

  const userFields = [
    { key: 'photo', label: 'Photo', sortable: false },
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'state_name', label: 'State', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  // ---------------- Fetch ----------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        pageNumber,
        pageSize,
        searchTerm,
        sortField,
        sortOrder,
      });
      const resUsers = await fetch(`${apiBase}/users?${queryParams}`, { headers });
      if (!resUsers.ok) throw new Error('Failed to fetch users');
      const usersJson = await resUsers.json();
      if (usersJson.status !== 'success') throw new Error(usersJson.message);
      setUsers(usersJson.data || []);
      setTotalPages(usersJson.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const resUser = await fetch(`${apiBase}/users/me`, { headers });
      if (!resUser.ok) throw new Error('Failed to fetch user data');
      const userJson = await resUser.json();
      if (userJson.status !== 'success') throw new Error(userJson.message);
      setUserData(userJson.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    else {
      fetchCurrentUser();
      fetchUsers();
    }
  }, [pageNumber, sortField, sortOrder]);

  // ---------------- Sorting ----------------
  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    else {
      setSortField(field);
      setSortOrder('ASC');
    }
    setPageNumber(1);
  };

  // ---------------- Smooth Debounced Search ----------------
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetch = useCallback(
    debounce(() => {
      setPageNumber(1);
      fetchUsers();
    }, 300),
    [searchTerm, sortField, sortOrder]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetch();
  };

  // ---------------- Pagination ----------------
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPageNumber(newPage);
  };

  // ---------------- Delete User ----------------
  const confirmDeleteUser = (userId) => setDeleteModal({ visible: true, userId });
  const cancelDeleteUser = () => setDeleteModal({ visible: false, userId: null });
  const deleteUser = async () => {
    try {
      const res = await fetch(`${apiBase}/users/${deleteModal.userId}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete user');
      await res.json();
      cancelDeleteUser();
      fetchUsers(); // refresh table only
    } catch (err) {
      console.error(err);
      cancelDeleteUser();
    }
  };

  // ---------------- Logout ----------------
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status" />
        <div>Loading...</div>
      </div>
    );

  if (error) return <div className="text-center p-5 text-danger">Error: {error}</div>;

  // ---------------- Summary Stats ----------------
  const completeProfiles =
    users.filter((u) => u.fullName && u.email && u.city && u.state_name).length || 0;

  const progressExample = [
    { title: 'Total Users', value: users.length, percent: 100, color: 'success' },
    {
      title: 'Complete Profiles',
      value: completeProfiles,
      percent: ((completeProfiles / users.length) * 100) || 0,
      color: 'info',
    },
  ];

  const genderStats = [
    { title: 'Male', icon: cilUser, value: users.filter((u) => u.gender === 'Male').length },
    { title: 'Female', icon: cilUserFemale, value: users.filter((u) => u.gender === 'Female').length },
  ];

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">Welcome, {userData ? userData.fullName : 'User'}</h4>
              <small className="text-muted">Your Dashboard</small>
            </div>
            <CButton color="primary" onClick={handleLogout}>
              <CIcon icon={cilCloudDownload} /> Logout
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <MainChart />

          <CRow className="mt-4">
            {progressExample.map((item, index) => (
              <CCol key={index}>
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold">{item.value}</div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardBody>
        <CCardFooter>
          <WidgetsBrand withCharts />
        </CCardFooter>
      </CCard>

      {/* Gender Breakdown */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>Users Demographics</CCardHeader>
            <CCardBody>
              {genderStats.map((item, index) => (
                <div className="progress-group mb-4" key={index}>
                  <div className="progress-group-header">
                    <CIcon className="me-2" icon={item.icon} size="lg" />
                    <span>{item.title}</span>
                    <span className="ms-auto fw-semibold">{item.value}</span>
                  </div>
                  <div className="progress-group-bars">
                    <CProgress thin color="warning" value={(item.value / users.length) * 100 || 0} />
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Users Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>All Users</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-end mb-3">
                <CFormInput
                  type="text"
                  placeholder="Search by name, email, phone, or city..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ maxWidth: '250px' }}
                />
              </div>

              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    {userFields.map((field) => (
                      <CTableHeaderCell
                        key={field.key}
                        onClick={() => field.sortable && handleSort(field.key)}
                        style={{ cursor: field.sortable ? 'pointer' : 'default', textAlign: 'center' }}
                      >
                        {field.label}{' '}
                        {field.sortable && sortField === field.key && (
                          <CIcon icon={sortOrder === 'ASC' ? cilArrowTop : cilArrowBottom} />
                        )}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user) => (
                    <CTableRow key={user.id}>
                      {userFields.map((field) => (
                        <CTableDataCell key={field.key} style={{ textAlign: 'center' }}>
                          {field.key === 'photo' ? (
                            user.photo ? (
                              <CAvatar src={`${baseUploadUrl}${user.photo}`} size="sm" />
                            ) : (
                              <CAvatar color="secondary" size="sm" text="?" />
                            )
                          ) : field.key === 'actions' ? (
                            <>
                              <CButton
                                size="sm"
                                color="info"
                                className="me-2"
                                onClick={() => navigate(`/users/${user.id}`)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton size="sm" color="danger" onClick={() => confirmDeleteUser(user.id)}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </>
                          ) : (
                            user[field.key] || 'N/A'
                          )}
                        </CTableDataCell>
                      ))}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <CPagination align="center" className="mt-3">
                <CPaginationItem disabled={pageNumber === 1} onClick={() => handlePageChange(pageNumber - 1)}>
                  Previous
                </CPaginationItem>
                {[...Array(totalPages).keys()].map((page) => (
                  <CPaginationItem
                    key={page + 1}
                    active={page + 1 === pageNumber}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={pageNumber === totalPages}
                  onClick={() => handlePageChange(pageNumber + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModal.visible} onClose={cancelDeleteUser}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this user?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={cancelDeleteUser}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={deleteUser}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Dashboard;
