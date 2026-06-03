const sequelize = require("../config/database");
require("../relationships");

const { Cabinet, CabinetBay } = require("../models");

const formatNumber = (number, length = 3) => {
  return String(number).padStart(length, "0");
};

const getSideCode = (side) => {
  return side === "LEFT" ? "L" : "R";
};

const buildBayCode = ({ cabinetCode, side, levelNumber, bayNumber }) => {
  return `${cabinetCode}-${getSideCode(side)}-L${formatNumber(
    levelNumber,
    2
  )}-B${formatNumber(bayNumber, 2)}`;
};

const createBaysForCabinet = async (cabinet) => {
  const sides = ["LEFT", "RIGHT"];
  const bays = [];

  for (const side of sides) {
    for (let level = 1; level <= cabinet.TotalLevels; level++) {
      for (let bay = 1; bay <= cabinet.TotalBays; bay++) {
        bays.push({
          CabinetID: cabinet.CabinetID,
          Side: side,
          LevelNumber: level,
          BayNumber: bay,
          BayCode: buildBayCode({
            cabinetCode: cabinet.CabinetCode,
            side,
            levelNumber: level,
            bayNumber: bay,
          }),
          MaxWeightKg: 50,
          CurrentWeightKg: 0,
          MaxBoxes: 3,
          CurrentBoxes: 0,
          Status: "AVAILABLE",
        });
      }
    }
  }

  await CabinetBay.bulkCreate(bays, {
    ignoreDuplicates: true,
  });
};

const seedCabinets = async () => {
  try {
    await sequelize.authenticate();

    const cabinets = [];

    // Zone A = 16 cabinets, 2 rows x 8 columns
    for (let i = 1; i <= 16; i++) {
      const floorRow = i <= 8 ? 1 : 2;
      const floorColumn = i <= 8 ? i : i - 8;

      cabinets.push({
        CabinetCode: `CAB-${formatNumber(i)}`,
        Zone: "A",
        FloorRow: floorRow,
        FloorColumn: floorColumn,
        TotalLevels: 6,
        TotalBays: 5,
        Status: "ACTIVE",
        Remarks: "Auto-created initial cabinet setup",
      });
    }

    // Zone B = 20 cabinets, 2 rows x 10 columns
    for (let i = 17; i <= 36; i++) {
      const zoneIndex = i - 16;
      const floorRow = zoneIndex <= 10 ? 1 : 2;
      const floorColumn = zoneIndex <= 10 ? zoneIndex : zoneIndex - 10;

      cabinets.push({
        CabinetCode: `CAB-${formatNumber(i)}`,
        Zone: "B",
        FloorRow: floorRow,
        FloorColumn: floorColumn,
        TotalLevels: 6,
        TotalBays: 5,
        Status: "ACTIVE",
        Remarks: "Auto-created initial cabinet setup",
      });
    }

    for (const cabinetData of cabinets) {
      const [cabinet] = await Cabinet.findOrCreate({
        where: { CabinetCode: cabinetData.CabinetCode },
        defaults: cabinetData,
      });

      await createBaysForCabinet(cabinet);
    }

    const cabinetCount = await Cabinet.count();
    const bayCount = await CabinetBay.count();

    console.log("Cabinet seed completed.");
    console.log(`Total cabinets: ${cabinetCount}`);
    console.log(`Total cabinet bays: ${bayCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Cabinet seed failed:", error);
    process.exit(1);
  }
};

seedCabinets();