const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const Project = require('../../models/project'); // Ensure this path is correct
const { setDownloadHeaders } = require('../../middlewares/downloadHelper');

// Define roles that can access the download functionality
const CENTER_ROLES = ['admin']; // You can add more roles if needed

// Helper function to retrieve projects for a specific role
const getProjectsForCenter = async (role) => {
  const projects = await Project.find({ assignedTo: role });
  if (!projects.length) throw new Error('No projects found');
  return projects;
};

// Controller to download the projects in CSV format
exports.downloadProjectsCSV = async (req, res) => {
  try {
    // Check if the user has the appropriate role
    const role = req.user.type;
    if (!CENTER_ROLES.includes(role)) return res.status(403).json({ error: 'Access denied' });

    // Get projects associated with the center role (admin)
    const projects = await getProjectsForCenter(role);

    // Prepare the data for CSV
    const data = projects.map(p => ({
      title: p.title,
      status: p.status,
      assignedTo: p.assignedTo,
      createdAt: p.createdAt.toISOString(),
    }));

    // Convert the data to CSV format
    const csv = new Parser().parse(data);

    // Generate timestamp for file naming
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Set download headers and send the CSV file
    setDownloadHeaders(res, `projects-${role}-${timestamp}.csv`, 'text/csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'CSV generation error', details: err.message });
  }
};

// Controller to download the projects in Excel format
exports.downloadProjectsExcel = async (req, res) => {
  try {
    // Check if the user has the appropriate role
    const role = req.user.type;
    if (!CENTER_ROLES.includes(role)) return res.status(403).json({ error: 'Access denied' });

    // Get projects associated with the center role (admin)
    const projects = await getProjectsForCenter(role);

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Projects');

    // Define the columns for the Excel sheet
    sheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Assigned To', key: 'assignedTo', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    // Set the header row to be bold
    sheet.getRow(1).font = { bold: true };

    // Add the project data to the sheet
    projects.forEach(p => {
      sheet.addRow({
        title: p.title,
        status: p.status,
        assignedTo: p.assignedTo,
        createdAt: p.createdAt.toISOString(),
      });
    });

    // Generate timestamp for file naming
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Set download headers for the Excel file
    setDownloadHeaders(res, `projects-${role}-${timestamp}.xlsx`, 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // Write the workbook to the response and end it
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Excel generation error', details: err.message });
  }
};
