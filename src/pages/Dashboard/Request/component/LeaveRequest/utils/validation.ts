// import * as Yup from 'yup';
// import { parseDateValue, transformDate } from '../../../../../config/constant/yupDateHelpers';
export {}
// export const LeaveRequestValidation  = Yup.object().shape({
//   startDate: Yup.date()
//     .nullable()
//     .transform(transformDate)
//     .required('Start Date is required'),
//   endDate: Yup.date()
//     .nullable()
//     .transform(transformDate)
//     .when('startDate', (startDate: any, schema: any) => {
//       const rawVal = Array.isArray(startDate) ? startDate[0] : startDate;
//       const targetDate = parseDateValue(rawVal);
//       return targetDate && !isNaN(targetDate.getTime())
//         ? schema.min(targetDate, 'End Date must be after Start Date')
//         : schema;
//     })
//     .required('End Date is required'),
//   reason: Yup.string().required('Reason is required').trim(),
//   workingLocation: Yup.mixed().required('Please Select the Working Location'),
//   leaveType: Yup.mixed().required('Please Select the Leave Type'),
//   sendTo: Yup.array().min(1, 'Please Select The manager'),
// });
