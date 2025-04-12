const express = require('express');
const router = express.Router();
const { createProject, getProjectStatus, editProject, submitProject, getProjectDetails } = require('../controllers/student/ProjectController');

/**
 * @swagger
 * /student/project/create:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with title, description, and a team.
 *     operationId: createProject
 *     tags:
 *       - Project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the project.
 *               description:
 *                 type: string
 *                 description: A detailed description of the project.
 *               team:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     first_name:
 *                       type: string
 *                       description: First name of the team member.
 *                     last_name:
 *                       type: string
 *                       description: Last name of the team member.
 *                     student_id:
 *                       type: string
 *                       description: The student ID of the team member.
 *                     year_of_inscription:
 *                       type: string
 *                       description: The year the student was enrolled.
 *                     speciality:
 *                       type: string
 *                       description: The student's specialty.
 *                     phone_number:
 *                       type: string
 *                       description: The team member's phone number.
 *                     email:
 *                       type: string
 *                       description: The team member's email address.
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the project.
 *     responses:
 *       201:
 *         description: Project created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project created successfully."
 *                 project:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     team:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Bad request, invalid input or missing fields.
 *       500:
 *         description: Server error.
 */

router.post('/project/create', createProject);

/**
 * @swagger
 * /student/edit-project:
 *   patch:
 *     summary: Edit an existing project
 *     description: Edit an existing project (title, description, or team members).
 *     operationId: editProject
 *     tags:
 *       - Project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: The ID of the project to be updated.
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               team:
 *                 type: array
 *                 items:
 *                   type: object
 *       responses:
 *         200:
 *           description: Project updated successfully.
 *         400:
 *           description: Invalid input or failed to update.
 *         404:
 *           description: Project not found.
 *         500:
 *           description: Server error.
 */
router.patch('/edit-project', editProject);

/**
 * @swagger
 * /student/submit-project/{projectId}:
 *   post:
 *     summary: Submit a project for review
 *     description: Submit the project for review and approval.
 *     operationId: submitProject
 *     tags:
 *       - Project
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to be submitted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project submitted successfully.
 *       400:
 *         description: Project already submitted or cannot be submitted.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Server error.
 */
router.post('/submit-project/:projectId', submitProject);

/**
 * @swagger
 * /student/project-status:
 *   get:
 *     summary: Get the status of a project
 *     description: Retrieve the current status of the user's project.
 *     operationId: getProjectStatus
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: Status of the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projectStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No project found for this user.
 *       500:
 *         description: Server error.
 */
router.get('/project-status', getProjectStatus);

/**
 * @swagger
 * /student/project-details:
 *   get:
 *     summary: Get project details
 *     description: Get all the details for the user's project.
 *     operationId: getProjectDetails
 *     tags:
 *       - Project
 *     responses:
 *       200:
 *         description: Project details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 team:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: No project found for this user.
 *       500:
 *         description: Server error.
 */
router.get('/project-details', getProjectDetails);

module.exports = router;
