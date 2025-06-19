const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  getAllApplications,
  updateApplicationStatus,
  getApplicationById,
  downloadDocument,
  viewProxyDocument,
  downloadProxyDocument
} = require("../controllers/adminController");
const { countApplicationsByStatus } = require("../controllers/adminController");

// Admin route to get all applications
router.get("/applications", protect, isAdmin, getAllApplications);

// Admin route to get a single application by ID
router.get("/applications/:id", protect, isAdmin, getApplicationById);

// Admin route to download documents (for local files, if still used)
router.get("/applications/:id/documents/:type", protect, isAdmin, downloadDocument);

// New Admin route to proxy view documents (for Cloudinary PDFs)
router.get("/applications/:id/documents/view-proxy", protect, isAdmin, viewProxyDocument);

// New Admin route to proxy download documents (for Cloudinary PDFs)
router.get("/applications/:id/documents/download-proxy", protect, isAdmin, downloadProxyDocument);

// Admin route to update the status of an application
router.put("/applications/:id", protect, isAdmin, updateApplicationStatus);

router.get('/count-by-status', countApplicationsByStatus);

module.exports = router;
