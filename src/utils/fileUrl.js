const getFileUrl = (req, filePath) => {
  if (!filePath) return null;

  const cleanPath = filePath.replace(/\\/g, '/');

  return `${req.protocol}://${req.get('host')}/${cleanPath}`;
};

module.exports = getFileUrl;