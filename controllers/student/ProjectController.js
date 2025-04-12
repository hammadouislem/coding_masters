const Project = require('../../models/project');
const GlobalDeadline = require('../../models/GlobalDeadline');

// Controller to create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, team, userId } = req.body; // Get userId from body
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Validate input data
    if (!title || !description || !team || team.length < 1 || team.length > 6) {
      return res.status(400).json({
        error: 'Invalid input data. Ensure title, description, and team size (1-6) are provided.',
      });
    }

    // Validate each team member's fields
    const validTeam = team.every((member) => {
      return (
        member.first_name &&
        member.last_name &&
        member.student_id &&
        member.year_of_inscription &&
        member.speciality &&
        member.phone_number &&
        member.email
      );
    });

    if (!validTeam) {
      return res.status(400).json({
        error: 'Each team member must have first_name, last_name, student_id, year_of_inscription, speciality, phone_number, and email.',
      });
    }

    // Check if user already submitted a project
    const existingProject = await Project.findOne({ createdBy: userId });
    if (existingProject) {
      return res.status(400).json({ error: 'You have already submitted a project.' });
    }

    // Create a new project
    const project = new Project({
      title,
      description,
      team,
      createdBy: userId,  // Use the userId from the body
      status: 'saved',
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully.', project });
  } catch (err) {
    res.status(400).json({ error: 'Error creating project', details: err.message });
  }
};

// Controller to edit an existing project
const editProject = async (req, res) => {
  try {
    const { projectId, title, description, team, userId } = req.body; // Get userId from body
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const project = await Project.findById(projectId);

    if (!project || project.createdBy.toString() !== userId) {
      return res.status(404).json({ error: 'Project not found or unauthorized.' });
    }

    // Check if the global deadline has passed
    const globalDeadline = await GlobalDeadline.findOne();
    if (globalDeadline && new Date() > new Date(globalDeadline.deadline)) {
      return res.status(400).json({ error: 'Cannot edit after global deadline has passed.' });
    }

    // Only update the fields that are passed
    project.title = title || project.title;
    project.description = description || project.description;
    project.team = team || project.team;

    await project.save();
    res.status(200).json({ message: 'Project updated successfully.', project });
  } catch (err) {
    res.status(400).json({ error: 'Error editing project', details: err.message });
  }
};

// Controller to submit a project
const submitProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project || project.createdBy !== req.user.userId) {
      return res.status(404).json({ error: 'Project not found or unauthorized.' });
    }

    if (project.status === 'sent') {
      return res.status(400).json({ error: 'Cannot modify the project after it has been submitted.' });
    }

    // Check if the global deadline has passed
    const globalDeadline = await GlobalDeadline.findOne();
    if (globalDeadline && new Date() > new Date(globalDeadline.deadline)) {
      project.status = 'sent'; // Automatically submit the project
      await project.save();
      return res.status(200).json({ message: 'Global deadline passed. Project has been submitted automatically.', project });
    }

    project.status = 'sent'; // Mark project as submitted
    await project.save();
    res.status(200).json({ message: 'Project has been submitted successfully.', project });
  } catch (err) {
    res.status(400).json({ error: 'Error submitting project.', details: err.message });
  }
};

const getProjectStatus = async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const projects = await Project.find({ createdBy: studentId });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'No projects found for this user.' });
    }

    const projectStatus = projects.map(project => ({
      title: project.title,
      status: project.status,
      createdAt: project.createdAt,
    }));

    res.status(200).json({ projectStatus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project statuses.', details: err.message });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const project = await Project.findOne({ createdBy: studentId });

    if (!project) {
      return res.status(404).json({ error: 'No project found for this user.' });
    }

    res.status(200).json({
      title: project.title,
      description: project.description,
      team: project.team,
      status: project.status,
      createdAt: project.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve project details.', details: err.message });
  }
}

module.exports = {
  createProject,
  getProjectStatus,
  editProject,
  submitProject,
  getProjectDetails
};
