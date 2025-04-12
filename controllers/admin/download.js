const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const Project = require('../../models/project');
const { setDownloadHeaders } = require('../../middlewares/downloadHelper');

const CENTER_ROLES = ['admin'];

const getProjectsForCenter = async (role) => {
  const projects = await Project.find({ assignedTo: role });
  if (!projects.length) throw new Error('No projects found');
  return projects;
};

exports.downloadProjectsCSV = async (req, res) => {
  try {
    const role = req.user.type;
    if (!CENTER_ROLES.includes(role)) return res.status(403).json({ error: 'Access denied' });

    const projects = await getProjectsForCenter(role);

    const data = projects.map(p => ({
      title: p.title,
      status: p.status,
      assignedTo: p.assignedTo,
      createdAt: p.createdAt.toISOString(),
    }));

    const csv = new Parser().parse(data);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    setDownloadHeaders(res, `projects-${role}-${timestamp}.csv`, 'text/csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'CSV generation error', details: err.message });
  }
};

exports.downloadProjectsExcel = async (req, res) => {
  try {
    const role = req.user.type;
    if (!CENTER_ROLES.includes(role)) return res.status(403).json({ error: 'Access denied' });

    const projects = await getProjectsForCenter(role);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Projects');

    sheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Assigned To', key: 'assignedTo', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    sheet.getRow(1).font = { bold: true };

    projects.forEach(p => {
      sheet.addRow({
        title: p.title,
        status: p.status,
        assignedTo: p.assignedTo,
        createdAt: p.createdAt.toISOString(),
      });
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    setDownloadHeaders(res, `projects-${role}-${timestamp}.xlsx`, 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Excel generation error', details: err.message });
  }
};
