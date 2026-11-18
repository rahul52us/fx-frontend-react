import * as Yup from "yup";
import { parseDateValue, transformDate } from "../../../../../config/constant/yupDateHelpers";

// Yup validation schema for Project
const ProjectCreateValidation = Yup.object().shape({
  project_name: Yup.string().trim().required("Project name is required."),
  subtitle: Yup.string().trim(),
  description: Yup.string()
    .trim()
    .min(2, "Description must have a minimum length of 2."),
  logo: Yup.string(),
  due_date: Yup.date().nullable().transform(transformDate),
  priority: Yup.mixed().required(),
  project_manager: Yup.array()
    .of(Yup.mixed())
    .nullable()
    .transform((val, originalVal) => {
      return originalVal === "" ? null : val;
    }),
  start_date: Yup.date()
    .nullable()
    .transform(transformDate)
    .typeError('start date is required'),
  end_date: Yup.date()
    .nullable()
    .transform(transformDate)
    .when("start_date", (start_date: any, schema: any) => {
      const rawVal = Array.isArray(start_date) ? start_date[0] : start_date;
      const targetDate = parseDateValue(rawVal);
      return targetDate && !isNaN(targetDate.getTime())
        ? schema.min(targetDate, "End date must be greater than or equal to the start date.")
        : schema;
    }),
  status: Yup.mixed().required('please select the status'),
  customers: Yup.array()
    .of(Yup.mixed())
    .nullable()
    .transform((val, originalVal) => {
      return originalVal === "" ? null : val;
    }).typeError('please select the customers'),
  followers: Yup.array()
    .of(Yup.mixed())
    .nullable()
    .transform((val, originalVal) => {
      return originalVal === "" ? null : val;
    }).typeError('please select the followers'),
  team_members: Yup.array()
    .of(Yup.mixed())
    .nullable()
    .transform((val, originalVal) => {
      return originalVal === "" ? null : val;
    }).typeError('please select the team members'),
  attach_files: Yup.array()
    .nullable().required('please select the files')
});

export { ProjectCreateValidation };
