import * as yup from "yup";

const departmentCategoryValidation = yup.object({
  title: yup
    .string()
    .min(2, "Title should be atleast of 2 character")
    .max(240, "Title should not be greater than 240 character")
    .trim()
    .required("Title is mandatory")
    .typeError("Title is mandatory"),
    code: yup
    .string()
    .min(2, "Code should be atleast of 2 character")
    .trim().required('Code is required')
});


export { departmentCategoryValidation };
