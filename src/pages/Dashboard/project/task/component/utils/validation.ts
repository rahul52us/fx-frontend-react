import * as Yup from "yup";

const attach_files = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must not exceed 120 characters")
    .required("Title is required"),
});

const UservalidationSchema = Yup.object().shape({
  user: Yup.mixed().required("Please select a user from the list"),
  isActive: Yup.boolean(),
});

// Yup validation schema for Project
const TaskCreateValidation = Yup.object().shape({
  title: Yup.string().trim().required("Title is required."),
  subtitle: Yup.string().trim(),
  isActive: Yup.mixed().required("Active state is required"),
  status: Yup.mixed().required("Please select the status"),
  description: Yup.string()
    .trim()
    .min(2, "Description must have a minimum length of 2."),
  dueDate: Yup.date(),
  startDate: Yup.date().typeError("Start date is required"),
  endDate: Yup.date().min(
    Yup.ref("startDate"),
    "End date must be greater than or equal to the start date."
  ),
  priority: Yup.mixed().required(),
  team_members: Yup.array().of(UservalidationSchema),
  dependencies: Yup.array().of(UservalidationSchema),
  assigner: Yup.array().of(UservalidationSchema),
  attach_files: Yup.array().of(attach_files),
});

export { TaskCreateValidation };
