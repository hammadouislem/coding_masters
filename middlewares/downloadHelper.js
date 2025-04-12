exports.setDownloadHeaders = (res, filename, contentType) => {
  res.header('Content-Type', contentType);
  res.header('Content-Disposition', `attachment; filename="${filename}"`);
};
