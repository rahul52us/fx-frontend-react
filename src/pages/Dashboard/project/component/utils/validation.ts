import * as Yup from "yup";
import { parseDateValue, transformDate } from "../../../../../config/constant/yupDateHelpers";

const UservalidationSchema = Yup.object().shape({
  user: Yup.mixed()
    .required("Please select a user from the list"),
  isActive: Yup.boolean(),
});

// Yup validation schema for Project
const ProjectCreateValidation = Yup.object().shape({
  project_name: Yup.string().trim().required("Project name is required."),
  subtitle: Yup.string().trim(),
  description: Yup.string()
    .trim()
    .min(2, "Description must have a minimum length of 2."),
  logo: Yup.mixed().required(),
  dueDate: Yup.date().nullable().transform(transformDate),
  priority: Yup.mixed().required(),
  startDate: Yup.date()
    .nullable()
    .transform(transformDate)
    .typeError('start date is required'),
  endDate: Yup.date()
    .nullable()
    .transform(transformDate)
    .when("startDate", (startDate: any, schema: any) => {
      const rawVal = Array.isArray(startDate) ? startDate[0] : startDate;
      const targetDate = parseDateValue(rawVal);
      return targetDate && !isNaN(targetDate.getTime())
        ? schema.min(targetDate, "End date must be greater than or equal to the start date.")
        : schema;
    }),
  status: Yup.mixed().required('please select the status'),
  customers: Yup.array()
  .of(UservalidationSchema),
    project_manager: Yup.array()
    .of(UservalidationSchema),
    team_members: Yup.array()
    .of(UservalidationSchema),
  followers: Yup.array()
    .of(UservalidationSchema),
  attach_files: Yup.array()
    .nullable().required('please select the files')
});

export { ProjectCreateValidation };
