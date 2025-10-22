const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const Record = require("../models/Record");
const sequelize = require("../config/db"); // Ensure sequelize is imported

// CREATE RECORD
exports.createRecord = catchAsync(async (req, res) => {
  const { full_Name, email, phone, gender, dob, state_name, city, address, pincode } = req.body;

  if (!full_Name || !email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Full name and email are required");
  }

  const existing = await Record.findOne({ where: { email, is_deleted: 0 } });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, `Email already exists: ${email}`);
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
    created_at: new Date(),
    updated_at: new Date(),
  });

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
    throw new ApiError(httpStatus.CONFLICT, `Email already exists: ${email}`);
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
    updated_at: new Date(),
  });

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

  await record.update({ is_deleted: 1, deletedAt: new Date() });

  res.status(httpStatus.OK).json({
    status: "success",
    message: `Record ${req.params.id} deleted successfully`,
  });
});

// Robust Bulk Insert (No Duplicate Emails)
exports.bulkInsertRecords = catchAsync(async (req, res) => {
  const records = req.body;

  if (!Array.isArray(records) || records.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or empty records array");
  }

  // Normalize and filter valid records
  let validRecords = records
    .filter((r) => r.full_Name && r.email) // Ensure required fields are present
    .map((r) => ({
      full_Name: r.full_Name?.trim(),
      email: r.email?.trim().toLowerCase(), // Normalize email
      phone: r.phone ? r.phone.trim() : null,
      gender: ["Male", "Female", "Other"].includes(r.gender) ? r.gender : null,
      dob: r.dob || null,
      state_name: r.state_name ? r.state_name.trim() : null,
      city: r.city ? r.city.trim() : null,
      address: r.address ? r.address.trim() : null,
      pincode: r.pincode ? r.pincode.trim() : null,
      is_created: 1,
      is_updated: 0,
      is_deleted: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }));

  if (validRecords.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "fail",
      message: "No valid records to insert (missing full_Name or email)",
    });
  }

  //  Remove duplicates within the uploaded data
  const seenEmails = new Set();
  const duplicateEmails = [];
  validRecords = validRecords.filter((r) => {
    if (seenEmails.has(r.email)) {
      duplicateEmails.push(r.email);
      return false;
    }
    seenEmails.add(r.email);
    return true;
  });

  if (duplicateEmails.length > 0) {
    console.warn(`Duplicate emails in input data: ${duplicateEmails.join(", ")}`);
  }

  //  Check for existing emails in the database
  const emails = validRecords.map((r) => r.email);
  const existingRecords = await Record.findAll({
    where: {
      email: { [Op.in]: emails },
      is_deleted: 0,
    },
    attributes: ["email"],
  });

  const existingEmailSet = new Set(existingRecords.map((r) => r.email.toLowerCase()));
  const newRecords = validRecords.filter((r) => !existingEmailSet.has(r.email));

  if (newRecords.length === 0) {
    return res.status(httpStatus.OK).json({
      status: "success",
      message: `No new records to insert (all emails already exist or invalid). Existing emails: ${[
        ...existingEmailSet,
      ].join(", ")}`,
      count: 0,
    });
  }

  // 4️⃣ Insert new records with transaction
  try {
    const created = await sequelize.transaction(async (t) => {
      return await Record.bulkCreate(newRecords, {
        validate: true,
        transaction: t,
        ignoreDuplicates: false, // Ensure duplicates cause an error
      });
    });

    res.status(httpStatus.CREATED).json({
      status: "success",
      message: "Bulk insert successful",
      count: created.length,
      insertedEmails: newRecords.map((r) => r.email),
    });
  } catch (error) {
    console.error("Bulk insert error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      const duplicateEmails = error.errors.map((err) => err.value).join(", ");
      throw new ApiError(
        httpStatus.CONFLICT,
        `Duplicate email(s) detected: ${duplicateEmails}`
      );
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to insert records: ${error.message || "Check data validity and required fields."}`
    );
  }
});

// 🟢 Bulk Update
exports.bulkUpdateRecords = catchAsync(async (req, res) => {
  const records = req.body;

  if (!Array.isArray(records) || records.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or empty records array");
  }

  const emails = records.filter((r) => r.email).map((r) => r.email.trim().toLowerCase());

  if (emails.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "fail",
      message: "No valid emails found in records",
    });
  }

  // Fetch all existing records
  const existingRecords = await Record.findAll({
    where: { email: { [Op.in]: emails }, is_deleted: 0 },
  });

  const existingMap = new Map(existingRecords.map((r) => [r.email.toLowerCase(), r]));

  let updateCount = 0;

  const updatePromises = records.map(async (r) => {
    const existing = existingMap.get(r.email?.trim().toLowerCase());
    if (!existing) return;

    try {
      await existing.update({
        full_Name: r.full_Name || existing.full_Name,
        phone: r.phone || existing.phone,
        gender: ["Male", "Female", "Other"].includes(r.gender) ? r.gender : existing.gender,
        dob: r.dob || existing.dob,
        state_name: r.state_name || existing.state_name,
        city: r.city || existing.city,
        address: r.address || existing.address,
        pincode: r.pincode || existing.pincode,
        is_updated: 1,
        updated_at: new Date(),
      });
      updateCount++;
    } catch (error) {
      console.error(`Failed to update record ${r.email}:`, error);
    }
  });

  await Promise.all(updatePromises);

  res.status(httpStatus.OK).json({
    status: "success",
    message: `Bulk update completed. Updated ${updateCount} record(s).`,
    count: updateCount,
  });
});