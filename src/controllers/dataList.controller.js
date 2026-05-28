const dataListService = require("../services/dataList.service");
const { ImportLog, ImportLogDetail } = require("../models");

const getAllDataLists = async (req, res) => {
  try {
    const dataLists = await dataListService.getAllDataLists();

    return res.status(200).json({
      success: true,
      data: dataLists,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch data list records",
      error: error.message,
    });
  }
};

const getDataListById = async (req, res) => {
  try {
    const dataList = await dataListService.getDataListById(req.params.id);

    if (!dataList) {
      return res.status(404).json({
        success: false,
        message: "Data list record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: dataList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch data list record",
      error: error.message,
    });
  }
};

const createDataList = async (req, res) => {
  try {
    const dataList = await dataListService.createDataList(req.body);

    return res.status(201).json({
      success: true,
      message: "Data list record created successfully",
      data: dataList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create data list record",
      error: error.message,
    });
  }
};

const bulkCreateDataLists = async (req, res) => {
  try {
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Rows must be a non-empty array",
      });
    }

    const payload = rows.map((row) => ({
      AgencyUniqueID: row.AgencyUniqueID,
      DataListItemNo: row.DataListItemNo,
      DataListSpecificName: row.DataListSpecificName,
      DataListPeriodCover: row.DataListPeriodCover,
      DataListRetentionPeriod: row.DataListRetentionPeriod,
    }));

    const result = await dataListService.bulkCreateDataLists(payload);

    const importLog = await ImportLog.create({
      ModuleName: "DataList",
      FileName: req.body.fileName || null,
      TotalRows: req.body.totalRows || rows.length,
      ImportedRows: result.importedRows,
      SkippedRows: (req.body.skippedRows || 0) + result.skippedRows,
      ImportedBy: req.body.importedBy || null,
    });

    if (result.duplicateRows.length > 0) {
      await ImportLogDetail.bulkCreate(
        result.duplicateRows.map((row) => ({
          ImportLogID: importLog.ImportLogID,
          RowNumber: row.rowNumber,
          AgencyUniqueID: row.AgencyUniqueID,
          DataListItemNo: row.DataListItemNo,
          DataListSpecificName: row.DataListSpecificName,
          DataListPeriodCover: row.DataListPeriodCover,
          DataListRetentionPeriod: row.DataListRetentionPeriod,
          Status: "SKIPPED",
          Reason: row.reason || "Duplicate record already exists",
        })),
      );
    }

    const frontendInvalidRows = req.body.frontendInvalidRows || [];

    if (frontendInvalidRows.length > 0) {
      await ImportLogDetail.bulkCreate(
        frontendInvalidRows.map((row) => ({
          ImportLogID: importLog.ImportLogID,
          RowNumber: row.rowNumber,
          AgencyUniqueID: row.AgencyUniqueID,
          DataListItemNo: row.DataListItemNo,
          DataListSpecificName: row.DataListSpecificName,
          DataListPeriodCover: row.DataListPeriodCover,
          DataListRetentionPeriod: row.DataListRetentionPeriod,
          Status: "INVALID",
          Reason: row.reason || "Frontend validation failed",
        })),
      );
    }

    return res.status(201).json({
      success: true,
      message: `${result.importedRows} data list record(s) imported, ${result.skippedRows} duplicate row(s) skipped`,
      data: {
        importedRows: result.importedRows,
        skippedRows: result.skippedRows,
        duplicateRows: result.duplicateRows,
        createdRecords: result.createdRecords,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to bulk import data lists",
      error: error.message,
    });
  }
};

const updateDataList = async (req, res) => {
  try {
    const dataList = await dataListService.updateDataList(
      req.params.id,
      req.body,
    );

    if (!dataList) {
      return res.status(404).json({
        success: false,
        message: "Data list record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data list record updated successfully",
      data: dataList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update data list record",
      error: error.message,
    });
  }
};

const deleteDataList = async (req, res) => {
  try {
    const dataList = await dataListService.deleteDataList(req.params.id);

    if (!dataList) {
      return res.status(404).json({
        success: false,
        message: "Data list record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data list record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete data list record",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDataLists,
  getDataListById,
  createDataList,
  bulkCreateDataLists,
  updateDataList,
  deleteDataList,
};
