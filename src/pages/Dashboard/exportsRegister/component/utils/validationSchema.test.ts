import { getExportRegisterValidationSchema } from "./validationSchema";
import { parseDateValue, transformDate } from "../../../../../config/constant/yupDateHelpers";

describe("Export Register Validation Schema and Date Helpers", () => {
  const schema = getExportRegisterValidationSchema(false);

  it("parses DD-MM-YYYY, DD/MM/YYYY, and YYYY-MM-DD correctly", () => {
    const d1 = parseDateValue("15-10-2025");
    const d2 = parseDateValue("15/10/2025");
    const d3 = parseDateValue("2025-10-15");

    expect(d1).not.toBeNull();
    expect(d2).not.toBeNull();
    expect(d3).not.toBeNull();
    expect(d1?.getDate()).toBe(15);
    expect(d1?.getMonth()).toBe(9);
    expect(d1?.getFullYear()).toBe(2025);
  });

  it("returns null for empty or invalid dates without throwing", () => {
    expect(parseDateValue("")).toBeNull();
    expect(parseDateValue(null)).toBeNull();
    expect(parseDateValue(undefined)).toBeNull();
    expect(parseDateValue("invalid-date")).toBeNull();
  });

  it("transforms empty values to null", () => {
    expect(transformDate(new Date(), "")).toBeNull();
    expect(transformDate(new Date(), null)).toBeNull();
  });

  it("validates export register schema without crashing on invalid or DD-MM-YYYY dates", async () => {
    // Valid shipment with DD-MM-YYYY dates
    await expect(
      schema.validate({
        exposureType: "shipment",
        amount: 1000,
        partyName: "ABC Corp",
        bank: "HDFC",
        poNo: "PO123",
        poDate: "10-05-2025",
        invoiceNo: "INV001",
        invoiceDate: "11-05-2025",
        blDate: "12-05-2025",
        dueDate: "15-05-2025",
        paymentTerms: 30,
        budgetRate: "83.5",
      })
    ).resolves.toBeDefined();

    // With invalid or empty dates during typing/editing, it should not throw TypeError "Invalid Date"
    await expect(
      schema.validate({
        exposureType: "shipment",
        amount: 1000,
        partyName: "ABC Corp",
        bank: "HDFC",
        poNo: "PO123",
        poDate: "invalid-date",
        invoiceNo: "INV001",
        invoiceDate: "invalid-date",
        blDate: "invalid-date",
        dueDate: "15-05-2025",
        paymentTerms: 30,
        budgetRate: "83.5",
      })
    ).rejects.not.toThrow(TypeError);
  });

  it("rejects dueDate that is earlier than blDate when both are valid", async () => {
    await expect(
      schema.validate({
        exposureType: "shipment",
        amount: 1000,
        partyName: "ABC Corp",
        bank: "HDFC",
        poNo: "PO123",
        poDate: "10-05-2025",
        invoiceNo: "INV001",
        invoiceDate: "11-05-2025",
        blDate: "12-05-2025",
        dueDate: "11-05-2025",
        paymentTerms: 30,
        budgetRate: "83.5",
      })
    ).rejects.toThrow(/(Due Date must be after BL Date|BL Date must be between PO Date and Due Date)/);
  });

  it("enforces PO Balance check on create but skips it in edit mode", async () => {
    const basePayload = {
      exposureType: "shipment",
      amount: 1000,
      partyName: "ABC Corp",
      bank: "HDFC",
      poNo: "PO123",
      poDate: "10-05-2025",
      invoiceNo: "INV001",
      invoiceDate: "11-05-2025",
      blDate: "12-05-2025",
      dueDate: "15-05-2025",
      paymentTerms: 30,
      budgetRate: "83.5",
    };

    const createSchema = getExportRegisterValidationSchema(false, 500);
    await expect(createSchema.validate(basePayload)).rejects.toThrow(
      "Amount cannot exceed Remaining Balance (500)"
    );

    const editSchema = getExportRegisterValidationSchema(true, 500);
    await expect(editSchema.validate(basePayload)).resolves.toBeDefined();
  });
});
