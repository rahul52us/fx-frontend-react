import * as Yup from "yup";
import { parseDateValue, transformDate } from "../../../../config/constant/yupDateHelpers";

const sectionValidation = Yup.object().shape({
  name: Yup.string().trim()
    .min(3, "Section Name must be at least 3 characters")
    .max(120, "Section Name must not exceed 120 characters")
});

export const ClassValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Class Name should be atleast of 3 characters")
    .max(80, "Class Name cannot be greater than 80 characters")
    .required("Class Name is required"),
  startYear: Yup.date()
    .nullable()
    .transform(transformDate)
    .required("Start Year is required"),
  endYear: Yup.date()
    .nullable()
    .transform(transformDate)
    .required("End Year is required")
    .when("startYear", (startYear: any, schema: any) => {
      const rawVal = Array.isArray(startYear) ? startYear[0] : startYear;
      const targetDate = parseDateValue(rawVal);
      return targetDate && !isNaN(targetDate.getTime())
        ? schema.min(targetDate, "End Year must be later than Start Year")
        : schema;
    }),
  medium: Yup.mixed()
    .required("Select the medium")
    .typeError("select the medium"),
  sections: Yup.array().of(sectionValidation),
});
