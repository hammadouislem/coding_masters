const express = require('express');
const router = express.Router();
const {
  updateProjectStatus,
  getAllProjects,
  setGlobalDeadline,
  setAllProjectSubmissionStatuses,
  getAllProjectStatuses,
  confirmAssignment,
} = require('../controllers/admin/adminController');
const {
  downloadProjectsExcel,
  downloadProjectsCSV,
} = require('../controllers/admin/download');
const { authMiddleware } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin related operations
 */

/**
 * @swagger
 * /admin/export-projects-excel:
 *   get:
 *     summary: Download projects in Excel format
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Projects exported successfully in Excel format
 *       403:
 *         description: Access denied for non-center roles
 *       500:
 *         description: Error generating the Excel file
 */
router.get('/export-projects-excel', downloadProjectsExcel);

/**
 * @swagger
 * /admin/export-projects-csv:
 *   get:
 *     summary: Download projects in CSV format
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Projects exported successfully in CSV format
 *       403:
 *         description: Access denied for non-center roles
 *       500:
 *         description: Error generating the CSV file
 */
router.get('/export-projects-csv', downloadProjectsCSV);

/**
 * @swagger
 * /admin/project-status/{projectId}:
 *   patch:
 *     summary: Update project status
 *     tags: [Admin]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         description: ID of the project to update status
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the project
 *                 example: "in progress"
 *     responses:
 *       200:
 *         description: Project status updated successfully
 *       400:
 *         description: Invalid status or status change not allowed
 *       404:
 *         description: Project not found
 *       500:
 *         description: Error updating project status
 */
router.patch('/project-status/:projectId', updateProjectStatus);

/**
 * @swagger
 * /admin/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Admin]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of projects per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of all projects
 *       500:
 *         description: Error fetching projects
 */
router.get('/projects', getAllProjects);

/**
 * @swagger
 * /admin/set-global-deadline:
 *   post:
 *     summary: Set or update the global deadline
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Global deadline to be set
 *     responses:
 *       200:
 *         description: Global deadline updated successfully
 *       400:
 *         description: Invalid deadline date format
 *       500:
 *         description: Error setting global deadline
 */
router.post('/set-global-deadline', setGlobalDeadline);

/**
 * @swagger
 * /admin/set-all-project-submission-statuses:
 *   post:
 *     summary: Set submission statuses of all projects based on deadlines
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Submission statuses updated successfully
 *       404:
 *         description: No pending projects found
 *       500:
 *         description: Error updating project statuses
 */
router.post('/set-all-project-submission-statuses', setAllProjectSubmissionStatuses);

/**
 * @swagger
 * /admin/project-statuses:
 *   get:
 *     summary: Get statuses of all projects
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of project statuses
 *       404:
 *         description: No projects found
 *       500:
 *         description: Error fetching project statuses
 */
router.get('/project-statuses', getAllProjectStatuses);

/**
 * @swagger
 * /admin/confirm-assignment:
 *   patch:
 *     summary: Confirm project assignment to a user
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: Project ID to be assigned
 *               assignedTo:
 *                 type: string
 *                 description: User ID to assign the project
 *     responses:
 *       200:
 *         description: Project assignment confirmed
 *       400:
 *         description: Assignment already confirmed or invalid project status
 *       404:
 *         description: Project not found
 *       500:
 *         description: Error confirming assignment
 */
router.patch('/confirm-assignment', confirmAssignment);

module.exports = router;
