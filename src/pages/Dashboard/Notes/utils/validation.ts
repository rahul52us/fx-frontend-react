import * as Yup from "yup";

const categoryValidation = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be 3 character")
    .max(150, "Title should not be greater than 150 character")
    .required("Title is required"),
  description: Yup.string()
    .min(60, "Description must be 60 character")
    .required("Description is required"),
  rating: Yup.number()
    .max(5, "Rating cannot be greater than 5")
    .min(1, "Rating cannot be less than 1")
    .required("Rating is required"),
  pricingType: Yup.mixed().required("Pricing Type is required"),
  amountType: Yup.mixed().required("Amount Type is required"),
  discountPrice: Yup.number().required("Discount Price is required"),
  originalPrice: Yup.number().required("Original Price is required"),
  startYear: Yup.date().required("Start Year is required"),
  endYear: Yup.date()
    .required("End Year is required")
    .min(Yup.ref("startYear"), "End Year must be later than Start Year"),
});

export const mainCourseValidation = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be 3 character")
    .max(150, "Title should not be greater than 150 character")
    .required("Title is required"),
  description: Yup.string()
    .min(60, "Description must be 60 character")
    .required("Description is required"),
  rating: Yup.number()
    .max(5, "Rating cannot be greater than 5")
    .min(1, "Rating cannot be less than 1")
    .required("Rating is required"),
  categories: Yup.array().of(categoryValidation),
});

export default mainCourseValidation;
