import * as Yup from "yup";

export const getForwardRegisterValidationSchema = (isEdit: boolean = false) => {
  return Yup.object({
    bookingDate: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : (originalValue ? new Date(originalValue) : value)
      )
      .required("Booking Date is required"),
    
    exposureType: Yup.string().required("Exposure Type is required"),
    
    subExposureType: Yup.string().when('exposureType', {
      is: (exposureType: string) => exposureType === 'import' || exposureType === 'export',
      then: (schema) => schema.required("Sub Exposure Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    
    bank: Yup.mixed().required("Bank is required"),
    
    bussinessUnit: Yup.mixed().required("Business Unit is required"),
    
    hedgeDealReferenceNumber: Yup.string().required(
      "Hedge Deal Reference Number is required"
    ),
    
    currency: Yup.mixed().required("Currency is required"),
    
    hedgeAmount: Yup.number().required("Hedge Amount is required"),
    
    spotBooked: Yup.string().required("Spot Booked is required"),
    
    forwardPoints: Yup.string().required("Forward Points is required"),
    
    bankMargin: Yup.string().required("Bank Margin is required"),
    
    hedgeRate: Yup.string().required("Hedge Rate is required"),
    
    dueDateFrom: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : (originalValue ? new Date(originalValue) : value)
      )
      .required("Due Date From is required"),
      
    dueDateTo: Yup.date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : (originalValue ? new Date(originalValue) : value)
      )
      .required("Due Date To is required"),

    exposureRefs: Yup.array().of(
      Yup.object({
        allocatedAmount: Yup.number().notRequired(),
      })
    ).test(
      "total-allocated-amount",
      "Total Allocated Amount must not exceed the Outstanding Amount",
      function (exposureRefs) {
        const { hedgeAmount, outstandingAmount } = this.parent;
    
        if (!exposureRefs || exposureRefs.length === 0) return true;
    
        const totalHedge = exposureRefs.reduce((sum: number, deal: any) => {
          return sum + (parseFloat(deal.allocatedAmount) || 0);
        }, 0);
    
        if (isEdit) {
          if (totalHedge > parseFloat(outstandingAmount)) {
            return this.createError({
              message: `Total Allocated Amount (${totalHedge}) must not exceed Outstanding Amount (${outstandingAmount})`,
            });
          }
          return true;
        }
    
        const amountVal = parseFloat(hedgeAmount);
        if (amountVal && totalHedge > amountVal) {
          return this.createError({
            message: `Total Allocated Amount (${totalHedge}) must not exceed Hedge Amount (${amountVal})`,
          });
        }
    
        return true;
      }
    ),
  });
};
