import * as Yup from "yup";

const workTimingSchema = Yup.object().shape({
    workTiming: Yup.array().of(
      Yup.object().shape({
        startTime: Yup.mixed().required("Start time is required"),
        endTime: Yup.mixed().required("End time is required"),
        daysOfWeek: Yup.array().min(1, "Select at least one day of the week"),
      })
    ),
});

export {workTimingSchema}