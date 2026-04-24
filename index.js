require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDb } = require("./db");
const healthRouter = require("./routes/health");
const adminAuthRouter = require("./routes/adminauthentication");
const userManagementRouter = require("./routes/usermanagement");
const serviceManagementRouter = require("./routes/servicemanagement");
const serviceCategoryManagementRouter = require("./routes/servicecategorymanagement");
const publicServicesRouter = require("./routes/publicservices");
const publicOrdersRouter = require("./routes/publicorders");
const publicProjectsRouter = require("./routes/publicprojects");
const orderManagementRouter = require("./routes/ordermanagement");
const projectManagementRouter = require("./routes/projectmanagement");
const dashboardRouter = require("./routes/dashboard");
const publicSeedRouter = require("./routes/publicseed");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("DB URL:", process.env.DATABASE_URL);

app.use("/health", healthRouter);
app.use("/services", publicServicesRouter);
app.use("/orders", publicOrdersRouter);
app.use("/projects", publicProjectsRouter);
app.use("/seed", publicSeedRouter);
app.use("/admin/auth", adminAuthRouter);
app.use("/admin/users", userManagementRouter);
app.use("/admin/services", serviceManagementRouter);
app.use("/admin/service-categories", serviceCategoryManagementRouter);
app.use("/admin/orders", orderManagementRouter);
app.use("/admin/projects", projectManagementRouter);
app.use("/admin/dashboard", dashboardRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
