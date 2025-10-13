
// const catchAsync = require("../utils/catchAsync");
// const httpStatus = require("http-status-codes");
// const ApiError = require("../utils/ApiError");
// const { Op } = require("sequelize");
// const Record = require("../models/Record");

// // CREATE RECORD
// exports.createRecord = catchAsync(async (req, res) => {
//   const { full_Name, email, phone, gender, dob, state_name, city, address, pincode } = req.body;

//   if (!full_Name || !email) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Full name and email are required");
//   }

//   const existing = await Record.findOne({ where: { email, is_deleted: 0 } });
//   if (existing) {
//     throw new ApiError(httpStatus.CONFLICT, "Email already exists");
//   }

//   const record = await Record.create({
//     full_Name,
//     email,
//     phone,
//     gender,
//     dob,
//     state_name,
//     city,
//     address,
//     pincode,
//     is_created: 1,
//     is_updated: 0,
//     is_deleted: 0,
//   });

//   res.status(httpStatus.CREATED).json({
//     status: "success",
//     data: record,
//   });
// });

// // GET RECORDS (Pagination + Search + Sort)
// exports.getRecords = catchAsync(async (req, res) => {
//   const pageSize = parseInt(req.query.pageSize) || 10;
//   const pageNumber = parseInt(req.query.pageNumber) || 1;
//   const searchTerm = req.query.searchTerm || "";
//   const sortField = req.query.sortField || "id";
//   const sortOrder = req.query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

//   const where = {
//     is_deleted: 0,
//     ...(searchTerm && {
//       [Op.or]: [
//         { full_Name: { [Op.like]: `%${searchTerm}%` } },
//         { email: { [Op.like]: `%${searchTerm}%` } },
//       ],
//     }),
//   };

//   const { count: totalRecords, rows: records } = await Record.findAndCountAll({
//     where,
//     order: [[sortField, sortOrder]],
//     limit: pageSize,
//     offset: (pageNumber - 1) * pageSize,
//   });

//   res.status(200).json({
//     status: "success",
//     data: records,
//     totalRecords,
//     totalPages: Math.ceil(totalRecords / pageSize),
//     currentPage: pageNumber,
//     pageSize,
//   });
// });

// // GET RECORD BY ID
// exports.getRecordById = catchAsync(async (req, res) => {
//   const record = await Record.findOne({ where: { id: req.params.id, is_deleted: 0 } });

//   if (!record) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
//   }

//   res.status(httpStatus.OK).json({
//     status: "success",
//     data: record,
//   });
// });

// // UPDATE RECORD
// exports.updateRecord = catchAsync(async (req, res) => {
//   const { full_Name, email, phone, gender, dob, state_name, city, address, pincode } = req.body;

//   if (!full_Name || !email) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Full name and email are required");
//   }

//   const existing = await Record.findOne({
//     where: { email, id: { [Op.ne]: req.params.id }, is_deleted: 0 },
//   });
//   if (existing) {
//     throw new ApiError(httpStatus.CONFLICT, "Email already exists");
//   }

//   const record = await Record.findOne({ where: { id: req.params.id, is_deleted: 0 } });
//   if (!record) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
//   }

//   await record.update({
//     full_Name,
//     email,
//     phone,
//     gender,
//     dob,
//     state_name,
//     city,
//     address,
//     pincode,
//     is_updated: 1,
//   });

//   res.status(httpStatus.OK).json({
//     status: "success",
//     data: record,
//   });
// });

// // SOFT DELETE RECORD
// exports.deleteRecord = catchAsync(async (req, res) => {
//   const record = await Record.findOne({ where: { id: req.params.id, is_deleted: 0 } });
//   if (!record) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
//   }

//   await record.update({ is_deleted: 1 });

//   res.status(httpStatus.OK).json({
//     status: "success",
//     message: `Record ${req.params.id} deleted successfully`,
//   });
// });


const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const Record = require("../models/Record");
const { broadcast } = require("../server"); // import broadcast from server.js

// CREATE RECORD
exports.createRecord = catchAsync(async (req, res) => {
  const { full_Name, email, phone, gender, dob, state_name, city, address, pincode } = req.body;

  if (!full_Name || !email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Full name and email are required");
  }

  const existing = await Record.findOne({ where: { email, is_deleted: 0 } });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  const record = await Record.create({
    full_Name,
    email,
    phone,
    gender,
    dob,
    state_name,
    city,
    address,
    pincode,
    is_created: 1,
    is_updated: 0,
    is_deleted: 0,
  });

  // Broadcast the new record to all WebSocket clients
  broadcast({ type: "insert", data: record });

  res.status(httpStatus.CREATED).json({
    status: "success",
    data: record,
  });
});

// GET RECORDS (Pagination + Search + Sort)
exports.getRecords = catchAsync(async (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 10;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const searchTerm = req.query.searchTerm || "";
  const sortField = req.query.sortField || "id";
  const sortOrder = req.query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const where = {
    is_deleted: 0,
    ...(searchTerm && {
      [Op.or]: [
        { full_Name: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } },
      ],
    }),
  };

  const { count: totalRecords, rows: records } = await Record.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
  });

  res.status(200).json({
    status: "success",
    data: records,
    totalRecords,
    totalPages: Math.ceil(totalRecords / pageSize),
    currentPage: pageNumber,
    pageSize,
  });
});

// GET RECORD BY ID
exports.getRecordById = catchAsync(async (req, res) => {
  const record = await Record.findOne({ where: { id: req.params.id, is_deleted: 0 } });

  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  res.status(httpStatus.OK).json({
    status: "success",
    data: record,
  });
});

// UPDATE RECORD
exports.updateRecord = catchAsync(async (req, res) => {
  const { full_Name, email, phone, gender, dob, state_name, city, address, pincode } = req.body;

  if (!full_Name || !email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Full name and email are required");
  }

  const existing = await Record.findOne({
    where: { email, id: { [Op.ne]: req.params.id }, is_deleted: 0 },
  });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  const record = await Record.findOne({ where: { id: req.params.id, is_deleted: 0 } });
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  await record.update({
    full_Name,
    email,
    phone,
    gender,
    dob,
    state_name,
    city,
    address,
    pincode,
    is_updated: 1,
  });

  // Broadcast the updated record to all WebSocket clients
  broadcast({ type: "update", data: record });

  res.status(httpStatus.OK).json({
    status: "success",
    data: record,
  });
});

// SOFT DELETE RECORD
exports.deleteRecord = catchAsync(async (req, res) => {
  const record = await Record.findOne({ where: { id: req.params.id, is_deleted: 0 } });
  if (!record) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  await record.update({ is_deleted: 1 });

  // Broadcast the deleted record ID to all WebSocket clients
  broadcast({ type: "delete", data: { id: req.params.id } });

  res.status(httpStatus.OK).json({
    status: "success",
    message: `Record ${req.params.id} deleted successfully`,
  });
});
