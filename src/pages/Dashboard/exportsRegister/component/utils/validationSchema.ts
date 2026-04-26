import * as Yup from "yup";

export const getExportRegisterValidationSchema = (isEdit: boolean = false, poBalance: number = Infinity) => {
  return Yup.object({
    exposureType: Yup.mixed().required("Exposure Type is required"),

    // ✅ Business Unit (only required for forecast & others except confirmed_order logic if needed)
    businessUnit: Yup.mixed().when("exposureType", {
      is: (val: string) => val === "forecast",
      then: (schema) => schema.required("Business Unit is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    currency: Yup.mixed().when("exposureType", {
      is: (val: string) => val === "forecast",
      then: (schema) => schema.required("Currency is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    amount: Yup.number()
      .required("Amount is required")
      // Shipment validation
      .when(["exposureType", "outStandingAmount"], {
        is: (exposureType: string, outStandingAmount: any) =>
          exposureType === "shipment" && !!outStandingAmount,
        then: (schema) =>
          schema.test("max-outStandingAmount", function (value) {
            const { outStandingAmount } = this.parent;
            if (value && outStandingAmount && value > outStandingAmount) {
              return this.createError({
                message: `Amount must be ≤ Outstanding Amount (${outStandingAmount})`,
              });
            }
            return true;
          }),
      })
      // LC/BC shifting validation using poBalance
      .when("exposureType", {
        is: (exposureType: string) => exposureType === "shipment",
        then: (schema) =>
          schema.test("max-poBalance", function (value) {
            if (value && poBalance !== Infinity && value > poBalance) {
              return this.createError({
                message: `Amount must be ≤ PO Balance (${poBalance})`,
              });
            }
            return true;
          }),
      }),

    dueDate: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : (originalValue ? new Date(originalValue) : value)
      )
      .when("exposureType", {
        is: (val: string) => val === "forecast",
        then: (schema) => schema.required("Due Date is required"),
        otherwise: (schema) =>
          schema.required("Due Date is required")
            .when("blDate", (blDate: any, schema: any) => {
              const dateValue = Array.isArray(blDate) ? blDate[0] : blDate;
              return dateValue
                ? schema.min(new Date(dateValue), "Due Date must be after BL Date")
                : schema;
            })
            .when("poDate", (poDate: any, schema: any) => {
              const dateValue = Array.isArray(poDate) ? poDate[0] : poDate;
              return dateValue
                ? schema.min(new Date(dateValue), "Due Date must be after PO Date")
                : schema;
            }),
      }),

    invoiceNo: Yup.string().when("exposureType", {
      is: (val: string) =>
        val !== "forecast" && val !== "confirmed_order",
      then: (schema) => schema.required("Invoice No is required"),
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

    poNo: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("PO No is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    paymentTerms: Yup.number().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("Payment terms is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    budgetRate: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("Budget Rate is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    poDate: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) => schema.required("PO Date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    invoiceDate: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : (originalValue ? new Date(originalValue) : value)
      )
      .when("exposureType", {
        is: (val: string) =>
          val !== "forecast" && val !== "confirmed_order",
        then: (schema) => schema.required("Invoice Date is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    blDate: Yup.string().when("exposureType", {
      is: (val: string) => val !== "forecast",
      then: (schema) =>
        schema.required("BL Date is required")
          .test(
            "bl-date-range",
            "BL Date must be between PO Date and Due Date",
            function (value) {
              const { poDate, dueDate } = this.parent;
              if (!value || !poDate || !dueDate) return true;
              const blDate = new Date(value);
              return (
                blDate >= new Date(poDate) &&
                blDate <= new Date(dueDate)
              );
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    hedgeDeals: Yup.array().of(
      Yup.object({
        hedgeAmount: Yup.number()
          .notRequired()
          .test("max-balance", function (value) {
            const { balanceAmount } = this.parent;
            const balance = parseFloat(balanceAmount) || 0;

            // ✅ Balance amount must be positive
            if (balance <= 0) {
              return this.createError({
                message: `Balance Amount must be positive (current: ${balance})`,
              });
            }

            // ✅ Hedge amount must be ≤ balance amount
            if (value && value > balance) {
              return this.createError({
                message: `Hedge Amount (${value}) must be ≤ Balance Amount (${balance})`,
              });
            }

            return true;
          }),
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
