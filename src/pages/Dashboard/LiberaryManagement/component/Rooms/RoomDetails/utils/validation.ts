import * as Yup from "yup";

const RoomValidationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    ratings: Yup.number().min(1).max(5),
    description: Yup.string().trim(),
})


export {RoomValidationSchema}