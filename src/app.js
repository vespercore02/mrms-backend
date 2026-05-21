const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const departmentRoutes = require('./routes/department.routes');
const seriesRoutes = require('./routes/series.routes');
const specificRoutes = require('./routes/specific.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'MRMS API is running',
  });
});

app.use('/api/departments', departmentRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/specifics', specificRoutes);

module.exports = app;