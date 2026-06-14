import * as Yup from "yup";

export const getImportRegisterValidationSchema = (isEdit: boolean = false, poBalance: number = Infinity) => {
  return Yup.object({
    exposureType: Yup.mixed().required("Exposure Type is required"),
    
    businessUnit: Yup.mixed().required("Business Unit is required"),

    currency: Yup.mixed().required("Currency is required"),

    amount: Yup.number()
      .required("Amount is required")
      .test(
        "po-balance-check",
        function (value: any) {
          const { exposureType } = this.parent;
          if (exposureType === "lc_bc_shifting") {
            if (value > poBalance) {
              return this.createError({
                message: `Amount (${value}) cannot be greater than PO Balance (${poBalance})`,
              });
            }
          }
          return true;
        }
      ),

    dueDate: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : (originalValue ? new Date(originalValue) : value)
      )
      .required("Due Date is required"),

    poDate: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("PO Date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    poNo: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("PO No is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    partyName: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("Party Name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    bank: Yup.mixed().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("Bank is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    blDate: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("BL Date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    paymentTerms: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("Payment Terms is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    budgetRate: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("Budget Rate is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    invoiceNo: Yup.string().when("exposureType", {
      is: (val: string) => val !== "da_dp" && val !== "forecast",
      then: (schema) => schema.required("Invoice No is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    invoiceDate: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : (originalValue ? new Date(originalValue) : value)
      )
      .when("exposureType", {
        is: (val: string) => val !== "da_dp" && val !== "forecast",
        then: (schema) => schema.required("Invoice Date is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    hedgeDeals: Yup.array().of(
      Yup.object({
        hedgeAmount: Yup.number().notRequired(),
      })
    ).test(
      "total-hedge-amount",
      "Total Hedge Amount must not exceed the Outstanding Amount",
      function (hedgeDeals) {
        const { amount, outstandingAmount } = this.parent;
    
        if (!hedgeDeals || hedgeDeals.length === 0) return true;
    
        const totalHedge = hedgeDeals.reduce((sum: number, deal: any) => {
          return sum + (parseFloat(deal.hedgeAmount) || 0);
        }, 0);
    
        if (isEdit) {
          if (totalHedge > parseFloat(outstandingAmount)) {
            return this.createError({
              message: `Total Hedge Amount (${totalHedge}) must not exceed Outstanding Amount (${outstandingAmount})`,
            });
          }
          return true;
        }
    
        const amountVal = parseFloat(amount);
        if (amountVal && totalHedge > amountVal) {
          return this.createError({
            message: `Total Hedge Amount (${totalHedge}) must not exceed Amount (${amountVal})`,
          });
        }
    
        return true;
      }
    ),
  });
};
