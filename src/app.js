const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { protect, allowRoles } = require('./middlewares/authMiddleware');

const departmentRoutes = require('./routes/department.routes');
const seriesRoutes = require('./routes/series.routes');
const specificRoutes = require('./routes/specific.routes');
const agencyFormRoutes = require('./routes/agencyForm.routes');
const dataListRoutes = require('./routes/dataList.routes');
const filePathRoutes = require('./routes/filePath.routes');
const roleRoutes = require('./routes/role.routes');
const userRoutes = require('./routes/user.routes');
const requestRoutes = require('./routes/request.routes');
const auditLogRoutes = require('./routes/auditLog.routes');
const authRoutes = require('./routes/auth.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'MRMS API is running',
  });
});

app.use('/api/departments', protect, departmentRoutes);
app.use('/api/series', protect, seriesRoutes);
app.use('/api/specifics', protect, specificRoutes);
app.use('/api/agency-forms', protect, agencyFormRoutes);
app.use('/api/data-lists', protect, dataListRoutes);
app.use('/api/file-paths', protect, filePathRoutes);
app.use('/api/roles', protect, allowRoles('Admin'), roleRoutes);
app.use('/api/users', protect, allowRoles('Admin'), userRoutes);
app.use('/api/requests', protect, requestRoutes);
app.use('/api/audit-logs', protect, auditLogRoutes);
app.use('/api/auth', authRoutes);


module.exports = app;