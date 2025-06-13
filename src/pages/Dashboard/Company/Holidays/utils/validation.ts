import * as yup from "yup";

const holidaysValidation = yup.object({
  title: yup
    .string()
    .min(2, "title should be atleast of 2 character")
    .max(120, "title should not be greater than 120 character")
    .trim()
    .required("title is mandatory")
    .typeError("Title is mandatory"),
  description: yup
    .string()
    .trim()
});


export { holidaysValidation };
