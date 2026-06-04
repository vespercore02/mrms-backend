const sequelize = require("../config/database");
const { Role } = require("../models");

const roles = [
  "Admin",
  "Records Officer",
  "Records Head",
  "Department Custodian",
  "Department Head",
  "Viewer",
];

const seedRoles = async () => {
  try {
    await sequelize.authenticate();

    for (const roleName of roles) {
      await Role.findOrCreate({
        where: { RoleName: roleName },
        defaults: { RoleName: roleName },
      });
    }

    console.log("Role seed completed.");
    console.log("Roles:");
    roles.forEach((role) => console.log(`- ${role}`));

    process.exit(0);
  } catch (error) {
    console.error("Role seed failed:", error);
    process.exit(1);
  }
};

seedRoles();