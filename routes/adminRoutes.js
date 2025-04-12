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
const roleCheck = require('../middlewares/RoleCheck');
const {
  downloadProjectsExcel,
  downloadProjectsCSV,
} = require('../controllers/admin/download');

router.use(roleCheck(['admin'])); // ✅ Auth + Role check

router.get('/export-projects-excel', downloadProjectsExcel);
router.get('/export-projects-csv', downloadProjectsCSV);
router.patch('/project-status/:projectId', updateProjectStatus);
router.get('/projects', getAllProjects);
router.post('/set-global-deadline', setGlobalDeadline);
router.post('/set-all-project-submission-statuses', setAllProjectSubmissionStatuses);
router.get('/project-statuses', getAllProjectStatuses);
router.patch('/confirm-assignment', confirmAssignment);

module.exports = router;
