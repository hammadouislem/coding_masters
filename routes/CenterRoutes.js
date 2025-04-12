const express = require('express');
const router = express.Router();
const { uploadPDF } = require('../middlewares/filesMiddleware');
const { uploadTrainingProgram } = require('../controllers/centers/TrainingProgram.js');
const { downloadProjectsCSV, downloadProjectsExcel } = require('../controllers/centers/assignment.js');
const { authMiddleware } = require("../middlewares/auth");

/**
 * @swagger
 * /center/upload-training-program:
 *   post:
 *     summary: Upload a training program PDF
 *     description: Uploads a PDF training program for all relevant center roles.
 *     tags:
 *       - Center
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file for the training program
 *     responses:
 *       201:
 *         description: Training program uploaded successfully.
 *       400:
 *         description: Bad request, file missing.
 *       500:
 *         description: Server error, upload failed.
 */
router.post('/upload-training-program', uploadPDF, uploadTrainingProgram);

/**
 * @swagger
 * /center/projects/export/csv:
 *   get:
 *     summary: Export projects as CSV
 *     description: Exports a list of projects for the center roles in CSV format.
 *     tags:
 *       - Center
 *     responses:
 *       200:
 *         description: A CSV file containing the project details.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       403:
 *         description: Access denied. Not a valid center role.
 *       404:
 *         description: No projects found for the center role.
 *       500:
 *         description: Server error, CSV generation failed.
 */
router.get('/projects/export/csv', downloadProjectsCSV);

/**
 * @swagger
 * /center/projects/export/excel:
 *   get:
 *     summary: Export projects as Excel
 *     description: Exports a list of projects for the center roles in Excel format.
 *     tags:
 *       - Center
 *     responses:
 *       200:
 *         description: An Excel file containing the project details.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *       403:
 *         description: Access denied. Not a valid center role.
 *       404:
 *         description: No projects found for the center role.
 *       500:
 *         description: Server error, Excel generation failed.
 */
router.get('/projects/export/excel', downloadProjectsExcel);


module.exports = router;
