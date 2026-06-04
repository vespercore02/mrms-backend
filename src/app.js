const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./utils/logger");
const { protect, allowRoles } = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");

const departmentRoutes = require("./routes/department.routes");
const seriesRoutes = require("./routes/series.routes");
const specificRoutes = require("./routes/specific.routes");
const agencyFormRoutes = require("./routes/agencyForm.routes");
const dataListRoutes = require("./routes/dataList.routes");
const filePathRoutes = require("./routes/filePath.routes");
const roleRoutes = require("./routes/role.routes");
const userRoutes = require("./routes/user.routes");
const requestRoutes = require("./routes/request.routes");
const auditLogRoutes = require("./routes/auditLog.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const importLogRoutes = require("./routes/importLog.routes");
const archiveRecordRoutes = require("./routes/archiveRecord.routes");

const cabinetRoutes = require("./routes/cabinet.routes");
const cabinetBayRoutes = require("./routes/cabinetBay.routes");
const storageBoxRoutes = require("./routes/storageBox.routes");
const boxRecordRoutes = require("./routes/boxRecord.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.get("/", (req, res) => {
  res.json({
    message: "MRMS API is running",
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use("/api/auth", authRoutes);

// Public muna habang dev, or protect later
app.use("/api/users", protect, allowRoles("Admin"), userRoutes);
app.use("/api/roles", protect, allowRoles("Admin"), roleRoutes);

app.use(
  "/api/dashboard",
  protect,
  allowRoles("Admin", "Records Officer", "Viewer"),
  dashboardRoutes,
);

app.use(
  "/api/data-lists",
  protect,
  allowRoles("Admin", "Records Officer", "Viewer"),
  dataListRoutes,
);

app.use(
  "/api/file-paths",
  protect,
  allowRoles("Admin", "Records Officer", "Viewer"),
  filePathRoutes,
);

// Requests
app.use(
  "/api/requests",
  protect,
  allowRoles("Admin", "Records Officer", "Viewer"),
  requestRoutes,
);

app.use(
  "/api/archive-records",
  protect,
  allowRoles("Admin", "Records Officer"),
  archiveRecordRoutes,
);

// Records master data
app.use(
  "/api/departments",
  protect,
  allowRoles("Admin", "Records Officer"),
  departmentRoutes,
);

app.use(
  "/api/series",
  protect,
  allowRoles("Admin", "Records Officer"),
  seriesRoutes,
);

app.use(
  "/api/specifics",
  protect,
  allowRoles("Admin", "Records Officer"),
  specificRoutes,
);

// Agency records
app.use(
  "/api/agency-forms",
  protect,
  allowRoles("Admin", "Records Officer"),
  agencyFormRoutes,
);

// Audit logs
app.use(
  "/api/audit-logs",
  protect,
  allowRoles("Admin", "Record Officer"),
  auditLogRoutes,
);

app.use(
  "/api/import-logs",
  protect,
  allowRoles("Admin", "Records Officer"),
  importLogRoutes,
);

app.use(
  "/api/cabinets",
  protect,
  allowRoles("Admin", "Records Officer"),
  cabinetRoutes,
);
app.use(
  "/api/cabinet-bays",
  protect,
  allowRoles("Admin", "Records Officer"),
  cabinetBayRoutes,
);
app.use(
  "/api/storage-boxes",
  protect,
  allowRoles("Admin", "Records Officer"),
  storageBoxRoutes,
);
app.use(
  "/api/box-records",
  protect,
  allowRoles("Admin", "Records Officer"),
  boxRecordRoutes,
);

app.use(errorHandler);

module.exports = app;
