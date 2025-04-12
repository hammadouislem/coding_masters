const express = require('express');
const router = express.Router();
const { uploadPDF } = require('../middlewares/filesMiddleware');
const { uploadTrainingProgram } = require('../controllers/centers/TrainingProgram.js');
const { downloadProjectsCSV, downloadProjectsExcel } = require('../controllers/centers/assignment.js');
const {authenticateUser} = require('../middlewares/auth'); // Import the authentication middleware

router.post('/upload-training-program', authenticateUser,uploadPDF, uploadTrainingProgram);

router.get('/projects/export/csv', downloadProjectsCSV);
router.get('/projects/export/excel', downloadProjectsExcel);

module.exports = router;
