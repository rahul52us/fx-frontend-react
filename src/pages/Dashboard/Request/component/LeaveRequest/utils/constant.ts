export const leaveRequestInitialValues = {
  startDate: new Date(),
  endDate: new Date(),
  leaveType: undefined,
  sendTo: [],
  reason: undefined,
  workingLocation:undefined,
  status: "Pending",
};

export const leavesTypes = [
  {
    label: "Sick Leave",
    value: "sl",
  },
  {
    label : 'Casual Leave (CL)',
    value : 'cl'
  },
  {
    label : 'Half CL (HCL)',
    value : 'hcl'
  },
  {
    label : 'Priviledge Leave (PL)',
    value : 'pl'
  },
  {
    label : 'Half PL (HPL)',
    value : 'hpl'
  },
  {
    label : 'Compensatory Off (COF)',
    value : ' cof'
  },
  {
    label : 'Half Comp. Off (HCF)',
    value : 'hcof'
  },
  {
    label : 'Outdoor Duty (OD)',
    value : 'od'
  },
  {
    label : 'Half Outdoor Duty (HOD)',
    value : 'hod'
  },
  {
    label : 'Work From Home (WFH)',
    value : 'wfh'
  },
  {
    label : 'Half Work From Home (HWFH)',
    value : 'hwfh'
  },
  {
    label : 'Special Leave',
    value : 'spl'
  },

];
