import { leavesTypes } from "./constant";
import { parseISO } from "date-fns";

export const generateRequestInitialValues = (data: any) => {
  return {
    startDate: data?.startDate ? parseISO(data.startDate) : new Date(),
    endDate: data?.endDate ? parseISO(data.endDate) : new Date(),
    leaveType: data
      ? leavesTypes.filter((item: any) => item.value === data.leaveType)
      : [],
    sendTo: data
      ? data.sendTo.map((item: any) => ({
          label: item.username,
          value: item._id,
        }))
      : [],
    reason: undefined,
    workingLocation: undefined,
    status: "pending",
  };
};

export const leaveRequestInitialValues = {
  startDate: new Date(),
  endDate: new Date(),
  leaveType: undefined,
  sendTo: [],
  reason: undefined,
  workingLocation: undefined,
  status: "Pending",
};

export const generateResponse = (values: any) => {
  let dt: any = { ...values };
  dt.sendTo = values.sendTo.map((item: any) => item.value);
  dt.workingLocation = values.workingLocation.value;
  dt.leaveType = values.leaveType.value;
  return dt;
};

export const generateTableRequestData = (data: any, type?: string) => {
  console.log("the type are", type);
  console.log("the data are", data);

  let dt = data.map((item: any) => {
    let status = (item.status === "submitted" && type) ? "pending" : item.status;
    return {
      ...item,
      status: status,
    };
  });


  console.log('the dt console are', dt)
  return dt
};
