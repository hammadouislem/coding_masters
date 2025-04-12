const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const Project = require('../../models/project');

const CENTER_ROLES = ['incubator', 'cati', 'cde'];

exports.downloadProjectsCSV = async (req, res) => {
  try {
    const role = req.user.role;

    if (!CENTER_ROLES.includes(role)) {
      return res.status(403).json({ error: 'Access denied. Not a center role.' });
    }

    const projects = await Project.find({ assignedTo: role });

    if (!projects.length) {
      return res.status(404).json({ error: 'No projects found for your center.' });
    }

    const data = projects.map(p => ({
      title: p.title,
      status: p.status,
      assignedTo: p.assignedTo,
      createdAt: p.createdAt.toISOString(),
    }));

    const csv = new Parser().parse(data);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="projects-${role}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'CSV generation error', details: err.message });
  }
};

exports.downloadProjectsExcel = async (req, res) => {
  try {
    const role = req.user.role;

    if (!CENTER_ROLES.includes(role)) {
      return res.status(403).json({ error: 'Access denied. Not a center role.' });
    }

    const projects = await Project.find({ assignedTo: role });

    if (!projects.length) {
      return res.status(404).json({ error: 'No projects found for your center.' });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Projects');

    sheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Assigned To', key: 'assignedTo', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    projects.forEach(p => {
      sheet.addRow({
        title: p.title,
        status: p.status,
        assignedTo: p.assignedTo,
        createdAt: p.createdAt.toISOString(),
      });
    });

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.header('Content-Disposition', `attachment; filename="projects-${role}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Excel generation error', details: err.message });
  }
};
