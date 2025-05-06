const express = require('express');
const router = express.Router();
const {
  changeApplicationStatus
} = require('../controllers/dashboardController');
router.put('/:applicationId', changeApplicationStatus);

module.exports = router;
