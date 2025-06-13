import * as Yup from "yup";

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
  dueDate: Yup.date(),
  priority: Yup.mixed().required(),
  startDate: Yup.date().typeError('start date is required'),
  endDate: Yup.date().min(
    Yup.ref("startDate"),
    "End date must be greater than or equal to the start date."
  ),
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
