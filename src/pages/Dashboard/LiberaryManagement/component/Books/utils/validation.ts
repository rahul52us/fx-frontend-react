import * as Yup from "yup";

const BookValidationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    author: Yup.string().trim(),
    categories: Yup.array(),
    publisher: Yup.string().trim(),
    isbn: Yup.string().trim(),
    edition: Yup.string().trim(),
    publishedDate: Yup.date(),
    numberOfPages: Yup.number(),
    availableCopies: Yup.number(),
    ratings: Yup.number().min(1).max(5),
    totalCopies: Yup.number(),
    language: Yup.array().min(1, "At least one language is required"),
    tags: Yup.array(),
    description: Yup.string().trim(),
})

const BookCategoryValidationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    description: Yup.string().trim(),
})

export {BookValidationSchema, BookCategoryValidationSchema}