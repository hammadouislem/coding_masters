const Project = require('../../models/project');
const GlobalDeadline = require('../../models/globalDeadline'); // make sure this model exists


exports.getAllProjects = async (req, res) => {


  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const limitInt = parseInt(limit);

    const projects = await Project.find()
      .skip(skip)
      .limit(limitInt)
      .populate('createdBy', 'name email');

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching all projects', details: err.message });
  }
};

exports.updateProjectStatus = async (req, res) => {

  try {
    const { projectId, status } = req.body;

    const validStatuses = ['sent', 'in progress', 'assigned', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (['assigned', 'sent'].includes(project.status)) {
      return res.status(400).json({
        error: 'Status cannot be changed after assignment or submission.',
      });
    }

    project.status = status;
    await project.save();

    res.status(200).json({
      message: `Project status updated to ${status}.`,
      project: { title: project.title, status: project.status },
    });
  } catch (err) {
    console.error('Error updating project status:', err);
    res.status(500).json({
      error: 'Error updating project status.',
      details: err.message,
    });
  }
};

exports.setGlobalDeadline = async (req, res) => {

  try {
    const { deadline } = req.body;

    // Validate the datetime-local string format
    if (!deadline || isNaN(new Date(deadline).getTime())) {
      return res.status(400).json({ error: 'Invalid deadline date format.' });
    }

    const parsedDeadline = new Date(deadline); // Converts the string to a Date object
    const existingDeadline = await GlobalDeadline.findOne();

    if (existingDeadline) {
      existingDeadline.deadline = parsedDeadline;
      await existingDeadline.save();
      res.status(200).json({ message: 'Global deadline updated successfully.' });
    } else {
      const newDeadline = new GlobalDeadline({ deadline: parsedDeadline });
      await newDeadline.save();
      res.status(201).json({ message: 'Global deadline set successfully.' });
    }
  } catch (err) {
    console.error('Error setting global deadline:', err);
    res.status(500).json({
      error: 'Error setting global deadline',
      details: err.message,
    });
  }
};

exports.setAllProjectSubmissionStatuses = async (req, res) => {

  try {
    const projects = await Project.find({ status: 'saved' });

    if (projects.length === 0) {
      return res.status(404).json({ error: 'No projects found in pending status.' });
    }

    let updatedProjects = [];
    let failedUpdates = [];

    for (let project of projects) {
      const deadline = project.deadline;

      if (isNaN(Date.parse(deadline))) {
        failedUpdates.push({ projectId: project._id, error: 'Invalid deadline date.' });
        continue;
      }

      if (new Date() > new Date(deadline) && project.status === 'saved') {
        project.status = 'sent';

        try {
          await project.save();
          updatedProjects.push(project);
        } catch (err) {
          failedUpdates.push({ projectId: project._id, error: err.message });
        }
      }
    }

    if (updatedProjects.length > 0) {
      res.status(200).json({
        message: `${updatedProjects.length} projects have been automatically submitted.`,
        updatedProjects
      });
    } else {
      res.status(200).json({ message: 'No projects were updated, deadline not passed.' });
    }

    if (failedUpdates.length > 0) {
      console.log('Failed to update the following projects:', failedUpdates);
    }

  } catch (err) {
    console.error('Error setting project statuses:', err);
    res.status(500).json({ error: 'Error setting project statuses.', details: err.message });
  }
};

exports.getAllProjectStatuses = async (req, res) => {

  try {
    const projects = await Project.find({}).select('title status createdBy');

    if (projects.length === 0) {
      return res.status(404).json({ error: 'No projects found.' });
    }

    const projectStatuses = projects.map(project => ({
      title: project.title,
      status: project.status,
      createdBy: project.createdBy,
    }));

    res.status(200).json({ projectStatuses });
  } catch (err) {
    console.error('Error fetching project statuses:', err);
    res.status(500).json({ error: 'Failed to fetch project statuses.', details: err.message });
  }
};

exports.confirmAssignment = async (req, res) => {

  try {
    const unprocessedProjects = await Project.find({
      status: { $nin: ['sent', 'in progress'] }
    });

    if (unprocessedProjects.length > 0) {
      return res.status(400).json({ error: 'Please process all submitted projects before confirming assignments.' });
    }

    const { projectId, assignedTo } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.assignedTo) {
      return res.status(400).json({ error: 'Assignment already confirmed. No further changes allowed.' });
    }

    project.assignedTo = assignedTo;
    await project.save();

    res.status(200).json({ message: 'Project direction confirmed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error confirming assignment.', details: err.message });
  }
};
