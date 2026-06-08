const sequelize = require("../config/database");
require("../relationships");

const {
  RequestType,
  RequestFormType,
  RequestRequiredForm,
} = require("../models");

const requestTypes = [
  {
    RequestTypeCode: "TRANSFER_NON_CURRENT_RECORDS",
    RequestTypeName: "Transfer of Non-Current Records",
    Description: "Request to transfer non-current records to the Central Records Office.",
  },
  {
    RequestTypeCode: "RECORDS_RETRIEVAL",
    RequestTypeName: "Records Retrieval",
    Description: "Request to retrieve records from storage.",
  },
  {
    RequestTypeCode: "RECORDS_RETURN",
    RequestTypeName: "Records Return",
    Description: "Return previously retrieved records back to storage.",
  },
  {
    RequestTypeCode: "RECORDS_DISPOSAL",
    RequestTypeName: "Records Disposal",
    Description: "Request for disposal of records based on approved retention rules.",
  },
  {
    RequestTypeCode: "RECORDS_INVENTORY",
    RequestTypeName: "Records Inventory",
    Description: "Inventory or verification of records.",
  },
];

const formTypes = [
  {
    FormCode: "ANNEX_A",
    FormName: "Request for Authority to Transfer Non-Current Records",
    FormCategory: "LGU",
    Description: "Initial request form for authority to transfer non-current records.",
  },
  {
    FormCode: "ANNEX_B",
    FormName: "Records Transmittal Form",
    FormCategory: "LGU",
    Description: "Form used during actual transmittal of records and boxes.",
  },
  {
    FormCode: "ANNEX_C",
    FormName: "Permanent Transfer Authorization Form",
    FormCategory: "LGU",
    Description: "Conditional form required for records with permanent retention.",
  },
  {
    FormCode: "NAP_FORM_1",
    FormName: "NAP Form 1",
    FormCategory: "NAP",
    Description: "National Archives of the Philippines form. Exact mapping to be finalized.",
  },
  {
    FormCode: "NAP_FORM_2",
    FormName: "NAP Form 2",
    FormCategory: "NAP",
    Description: "National Archives of the Philippines form. Exact mapping to be finalized.",
  },
  {
    FormCode: "NAP_FORM_3",
    FormName: "Records Disposal Form",
    FormCategory: "NAP",
    Description: "NAP form commonly associated with records disposal process.",
  },
];

const requiredFormMatrix = [
  {
    requestTypeCode: "TRANSFER_NON_CURRENT_RECORDS",
    forms: [
      {
        formCode: "ANNEX_A",
        RequirementType: "REQUIRED",
        TriggerCondition: null,
        SortOrder: 1,
      },
      {
        formCode: "ANNEX_B",
        RequirementType: "REQUIRED",
        TriggerCondition: "After approval / during actual records transmittal",
        SortOrder: 2,
      },
      {
        formCode: "ANNEX_C",
        RequirementType: "CONDITIONAL",
        TriggerCondition: "Required only if permanent records are included",
        SortOrder: 3,
      },
      {
        formCode: "NAP_FORM_1",
        RequirementType: "OPTIONAL",
        TriggerCondition: "To be finalized based on office/NAP process",
        SortOrder: 4,
      },
    ],
  },
  {
    requestTypeCode: "RECORDS_DISPOSAL",
    forms: [
      {
        formCode: "NAP_FORM_3",
        RequirementType: "REQUIRED",
        TriggerCondition: null,
        SortOrder: 1,
      },
    ],
  },
];

const seedRequestV2Foundation = async () => {
  try {
    await sequelize.authenticate();

    const requestTypeMap = {};
    const formTypeMap = {};

    for (const item of requestTypes) {
      const [requestType] = await RequestType.findOrCreate({
        where: { RequestTypeCode: item.RequestTypeCode },
        defaults: {
          ...item,
          Status: "ACTIVE",
        },
      });

      requestTypeMap[item.RequestTypeCode] = requestType;
    }

    for (const item of formTypes) {
      const [formType] = await RequestFormType.findOrCreate({
        where: { FormCode: item.FormCode },
        defaults: {
          ...item,
          Status: "ACTIVE",
        },
      });

      formTypeMap[item.FormCode] = formType;
    }

    for (const matrix of requiredFormMatrix) {
      const requestType = requestTypeMap[matrix.requestTypeCode];

      for (const form of matrix.forms) {
        const formType = formTypeMap[form.formCode];

        if (!requestType || !formType) continue;

        await RequestRequiredForm.findOrCreate({
          where: {
            RequestTypeID: requestType.RequestTypeID,
            RequestFormTypeID: formType.RequestFormTypeID,
          },
          defaults: {
            RequestTypeID: requestType.RequestTypeID,
            RequestFormTypeID: formType.RequestFormTypeID,
            RequirementType: form.RequirementType,
            TriggerCondition: form.TriggerCondition,
            SortOrder: form.SortOrder,
            Status: "ACTIVE",
          },
        });
      }
    }

    console.log("Request v2 foundation seed completed.");
    console.log(`Request Types: ${await RequestType.count()}`);
    console.log(`Form Types: ${await RequestFormType.count()}`);
    console.log(`Required Forms: ${await RequestRequiredForm.count()}`);

    process.exit(0);
  } catch (error) {
    console.error("Request v2 foundation seed failed:", error);
    process.exit(1);
  }
};

seedRequestV2Foundation();