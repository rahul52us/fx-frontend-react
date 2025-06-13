import {
  formatDate,
  YYYYMMDD_FORMAT,
} from "../../../../../../config/constant/dateUtils";
import { getUniqueUsers, readFileAsBase64 } from "../../../../../../config/constant/function";
import { activeStatus, taskPrioties, taskStatus } from "./constant";

export const generateSendTaskResponse = async(val: any) => {

  let values: any = { ...val };

  // Process attach_files separately and asynchronously
  const processedFiles = await Promise.all(
    values.attach_files.map(async (item: any) => {
      if (item.isAdd && item.file) {
        try {
          const base64Data = await readFileAsBase64(item.file[0]);
          return { ...item, file: { buffer: base64Data, type: item.file[0]?.type, filename: item.file[0]?.name } };
        } catch {
          return item;
        }
      }
      else if(!item.file){
        return {...item,file : null};
      }
      else {
        return {...item,file : {...item.file[0]}};
      }
    })
  );

  return {
    ...values,
    attach_files: processedFiles,
    priority: values?.priority
      ? values?.priority?.value
      : taskPrioties[1].value,
    isActive: values.isActive ? values?.isActive?.value : activeStatus[1],
    status: values?.status ? values?.status?.value : taskStatus[0].value,
    team_members: getUniqueUsers(values.team_members || []),
    assigner: getUniqueUsers(values.assigner || []),
    dependencies: getUniqueUsers(values.dependencies || []),
    reminders: [values.reminders],
    startDate: values?.startDate
      ? formatDate(values?.startDate, YYYYMMDD_FORMAT)
      : new Date(),
    endDate: values?.endDate
      ? formatDate(values.endDate, YYYYMMDD_FORMAT)
      : new Date(),
    dueDate: values?.dueDate
      ? formatDate(values?.dueDate, YYYYMMDD_FORMAT)
      : new Date(),
  };
};

export const generateInitialValues = (data?: any) => {
  if (!data) {
    data = {};
  }

  return {
    ...data,
    deleteAttachments : [],
      assigner: Array.isArray(data.assigner) ? data.assigner.map((item: any) => ({
        user: item.user,
        isActive: item.isActive
      })) : [],
    team_members: Array.isArray(data.team_members) ? data.team_members.map((item: any) => ({
      user: item.user,
      isActive: item.isActive
    })) : [],
    dependencies: Array.isArray(data.dependencies) ? data.dependencies.map((item: any) => ({
      user: item.user,
      isActive: item.isActive
    })) : [],
    title: data?.title || "",
    description: data?.description || "",
    isActive: data
      ? activeStatus.find((it: any) => it.value === data.isActive) ||
        activeStatus[0]
      : activeStatus[0],
    startDate: new Date(),
    endDate: new Date(),
    dueDate: new Date(),
    priority: data
      ? taskPrioties.find((it: any) => it.value === data.priority) ||
        taskPrioties[0]
      : taskPrioties[0],
    reminders: new Date(),
    attach_files: data?.attach_files?.map((it: any) => ({
      ...it,
      file: it.file ? [it.file] : undefined,
    })),
    // followers: [],
    // dependencies:[],
    // team_members: [],
    // customers: [],
    // assigner:undefined,
    // project_manager: [],
    status: data
      ? taskStatus.find((it: any) => it.value === data.status) || taskStatus[0]
      : taskStatus[0],
  };
};
