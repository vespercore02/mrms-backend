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

const requestV2FoundationRoutes = require("./routes/requestV2Foundation.routes");
const requestFormRoutes = require("./routes/requestForm.routes");

const app = express();

const ADMIN_ONLY = ["Admin"];

const CRO_MANAGEMENT = ["Admin", "Records Head"];

const CRO_OPERATIONS = ["Admin", "Records Head", "Records Officer"];

const REQUEST_USERS = [
  "Admin",
  "Records Head",
  "Records Officer",
  "Department Head",
  "Department Custodian",
  "Viewer",
];

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

app.use(
  "/api/users",
  protect,
  allowRoles(...ADMIN_ONLY),
  userRoutes,
);

app.use(
  "/api/roles",
  protect,
  allowRoles(...ADMIN_ONLY),
  roleRoutes,
);

app.use(
  "/api/dashboard",
  protect,
  allowRoles(...REQUEST_USERS),
  dashboardRoutes,
);

app.use(
  "/api/requests",
  protect,
  allowRoles(
    "Admin",
    "Records Head",
    "Records Officer",
    "Department Head",
    "Department Custodian",
    "Viewer"
  ),
  requestRoutes
);

app.use(
  "/api/data-lists",
  protect,
  allowRoles(...CRO_OPERATIONS),
  dataListRoutes,
);

app.use(
  "/api/file-paths",
  protect,
  allowRoles(...CRO_OPERATIONS),
  filePathRoutes,
);

app.use(
  "/api/archive-records",
  protect,
  allowRoles(...CRO_OPERATIONS),
  archiveRecordRoutes,
);

app.use(
  "/api/departments",
  protect,
  allowRoles(...REQUEST_USERS),
  departmentRoutes,
);

app.use(
  "/api/series",
  protect,
  allowRoles(...CRO_OPERATIONS),
  seriesRoutes,
);

app.use(
  "/api/specifics",
  protect,
  allowRoles(...CRO_OPERATIONS),
  specificRoutes,
);

app.use(
  "/api/agency-forms",
  protect,
  allowRoles(...REQUEST_USERS),
  agencyFormRoutes,
);

app.use(
  "/api/audit-logs",
  protect,
  allowRoles(...CRO_MANAGEMENT),
  auditLogRoutes,
);

app.use(
  "/api/import-logs",
  protect,
  allowRoles(...CRO_OPERATIONS),
  importLogRoutes,
);

app.use(
  "/api/cabinets",
  protect,
  allowRoles(...CRO_OPERATIONS),
  cabinetRoutes,
);

app.use(
  "/api/cabinet-bays",
  protect,
  allowRoles(...CRO_OPERATIONS),
  cabinetBayRoutes,
);

app.use(
  "/api/storage-boxes",
  protect,
  allowRoles(...CRO_OPERATIONS),
  storageBoxRoutes,
);

app.use(
  "/api/box-records",
  protect,
  allowRoles(...CRO_OPERATIONS),
  boxRecordRoutes,
);

app.use(
  "/api/request-v2",
  protect,
  allowRoles(
    "Admin",
    "Records Head",
    "Records Officer",
    "Department Head",
    "Department Custodian",
    "Viewer"
  ),
  requestV2FoundationRoutes
);

app.use(
  "/api/request-forms",
  protect,
  allowRoles(
    "Admin",
    "Records Head",
    "Records Officer",
    "Department Head",
    "Department Custodian"
  ),
  requestFormRoutes
);

app.use(errorHandler);

module.exports = app;
