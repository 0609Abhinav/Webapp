// routes/recordRoutes.js
const express = require("express");
const router = express.Router();
const recordController = require("../controllers/RecordCRUDController");

/* ---------------------------------------------
   RECORD CRUD ROUTES (RESTful API structure)
---------------------------------------------- */

// CREATE Record
router.post("/", recordController.createRecord);

// GET all records (with optional search, sort, pagination)
router.get("/", recordController.getRecords);

// GET a single record by ID
router.get("/:id", recordController.getRecordById);

// UPDATE a record
router.put("/:id", recordController.updateRecord);

// DELETE a record (soft delete)
router.delete("/:id", recordController.deleteRecord);

module.exports = router;



//  Bulk insert (new records from Excel)
router.post("/bulk-insert", recordController.bulkInsertRecords);

//  Bulk update (existing records matched by email or ID)
router.put("/bulk-update", recordController.bulkUpdateRecords);
