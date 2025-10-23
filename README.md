# 🧾 Records Management System

An advanced **React + Node.js + MySQL (Sequelize)** full-stack application for managing user records with real-time WebSocket updates, Excel import/export, authentication, and dynamic dropdowns.

---

## 🚀 Features

✅ Add / Edit / Delete Records  
✅ WebSocket Live Updates  
✅ Search, Sort, and Pagination  
✅ Excel Import & Export (XLSX)  
✅ Toast Notifications  
✅ **Profile Picture Upload with Preview**  
✅ **State–City Cascading Dropdowns**  
✅ JWT Authentication & Role-based Access  
✅ Multer-based File Upload Handling  

---

## 🧩 New Enhancements (2025 Update)

### 🖼️ 1. Profile Picture Upload & Preview

This feature allows users to **upload and preview a profile picture** before saving the record.

#### Frontend (React)
```jsx
<CInputGroup className="mb-4">
  <CInputGroupText className="bg-gray-100">
    <CIcon icon={cilUser} />
  </CInputGroupText>
  <CFormInput
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, photo: file }));
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, photoPreview: previewUrl }));
      }
    }}
  />
</CInputGroup>

{formData.photoPreview && (
  <div className="text-center mb-4">
    <img
      src={formData.photoPreview}
      alt="Profile Preview"
      className="rounded-full shadow-md"
      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
    />
  </div>
)}
```

#### Backend (Express + Multer)
```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});
const upload = multer({ storage });

router.put('/me', authenticate, upload.single('photo'), userController.updateUser);
router.post('/register', upload.single('photo'), userController.createUser);
```
Uploaded files are saved in the `Uploads/` directory.

---

### 🌍 2. State–City Cascading Dropdowns

Dynamically loads cities based on the selected state.

#### Frontend (React)
```jsx
<CFormSelect
  name="state_name"
  value={formData.state_name}
  onChange={(e) => {
    handleChange(e);
    fetchCities(e.target.value);
  }}
  className="mb-4"
>
  <option value="">Select State *</option>
  {states.map((state) => (
    <option key={state.id} value={state.state_name}>
      {state.state_name}
    </option>
  ))}
</CFormSelect>

<CFormSelect
  name="city"
  value={formData.city}
  onChange={handleChange}
  className="mb-4"
  disabled={!formData.state_name}
>
  <option value="">Select City *</option>
  {cities.map((city) => (
    <option key={city.id} value={city.city_name}>
      {city.city_name}
    </option>
  ))}
</CFormSelect>
```

#### Backend (Sequelize + Stored Procedure)
```js
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getStates = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber, 10) || 0;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    const states = await sequelize.query(
      'CALL get_states(:pageNumber, :pageSize)',
      { replacements: { pageNumber, pageSize }, type: QueryTypes.RAW }
    );

    const normalizedStates = Array.isArray(states[0]) ? states[0] : states;

    res.status(200).json({
      pageNumber,
      pageSize,
      states: normalizedStates,
      count: normalizedStates.length
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ message: 'Failed to fetch states', error: error.message });
  }
};
```

---

### 📦 Backend API Structure

#### `routes/userRoutes.js`
```js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});
const upload = multer({ storage });

router.get('/', userController.getUsers);
router.get('/me', authenticate, userController.getCurrentUser);
router.get('/:id', authenticate, userController.getUserById);
router.put('/me', authenticate, upload.single('photo'), userController.updateUser);
router.put('/:id', authenticate, upload.single('photo'), userController.updateUserById);
router.delete('/:id', authenticate, userController.deleteUser);
router.post('/register', upload.single('photo'), userController.createUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;
```

---

## 🧠 Tech Stack

**Frontend:** React, CoreUI, Axios, XLSX, FileSaver, WebSockets  
**Backend:** Node.js, Express.js, Sequelize (MySQL)  
**Storage:** Multer for File Uploads  
**Security:** JWT Authentication  
**Export:** Excel (XLSX)

---

## 🖼️ Screenshots

_Add screenshots here to visually demonstrate features:_

1. 🧑‍💻 **Dashboard View** –  
   ![Dashboard Screenshot](./screenshots/dashboard.png)

2. 📋 **Add/Edit Record Modal with Preview** –  
   ![Modal Screenshot](./screenshots/modal_preview.png)

3. 🌍 **Cascading Dropdown (State → City)** –  
   ![Dropdown Screenshot](./screenshots/cascading_dropdown.png)

---

## ⚙️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-username/records-management.git
cd records-management

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start backend server
npm run server

# Start frontend
npm start
```

---

## 📞 Support

For issues or contributions, open a GitHub issue or contact **abhinavtripathi6sep@gmail.com**.

---
© 2025 Records Management System. All rights reserved.
