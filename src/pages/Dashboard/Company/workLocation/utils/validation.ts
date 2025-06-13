import * as yup from "yup";

const workLocationValidaion = yup.object({
  locationName: yup
    .string()
    .min(2, "Location should be atleast of 2 character")
    .max(240, "Location should not be greater than 240 character")
    .trim()
    .required("Location is mandatory")
    .typeError("Location is mandatory"),
    ipAddress: yup
    .string()
    .min(2, "ipAddress should be atleast of 2 character")
    .trim()
});


export { workLocationValidaion };
