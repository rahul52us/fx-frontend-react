import * as Yup from 'yup';

export const LeaveRequestValidation  = Yup.object().shape({
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End Date must be after Start Date')
    .required('End Date is required'),
  reason: Yup.string().required('Reason is required').trim(),
  workingLocation: Yup.mixed().required('Please Select the Working Location'),
  leaveType: Yup.mixed().required('Please Select the Leave Type'),
  sendTo: Yup.array().min(1, 'Please Select The manager'),
});
