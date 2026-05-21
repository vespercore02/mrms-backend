require('dotenv').config();

const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { Role, User } = require('../models');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();

    const [adminRole] = await Role.findOrCreate({
      where: { RoleName: 'Admin' },
      defaults: { RoleName: 'Admin' },
    });

    const existingAdmin = await User.findOne({
      where: { Email: 'admin@mrms.local' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      FullName: 'System Admin',
      Email: 'admin@mrms.local',
      Password: hashedPassword,
      RoleID: adminRole.RoleID,
      Status: 'active',
    });

    console.log('Admin user created successfully.');
    console.log('Email: admin@mrms.local');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error('Seed admin failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();