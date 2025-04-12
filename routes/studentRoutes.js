const express = require('express');
const router = express.Router();
const { createProject, getProjectStatus, editProject , submitProject} = require('../controllers/student/ProjectController');
const { getTrainingProgram} = require('../controllers/student/TrainingController');
const { validateProjectCreation, validateProjectUpdate } = require('../schema/students');
const { validationResult } = require('express-validator');


router.post('/project/create', validateProjectCreation, handleValidationErrors, createProject);
router.patch('/edit-project', validateProjectUpdate, handleValidationErrors, editProject);
router.get('/project-status', getProjectStatus);
router.post('/submit-project/:projectId', submitProject);
router.get('/training-program', getTrainingProgram);

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = router;
