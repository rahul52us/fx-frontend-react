import {
  formatDate,
  YYYYMMDD_FORMAT,
} from "../../../../../config/constant/dateUtils";
import { getUniqueUsers, readFileAsBase64 } from "../../../../../config/constant/function";
import { ProjectPrioties, projectStatus } from "./constant";

export const generateProjectInitialValues = (values: any) => {
  return {
    ...values,
    deleteAttachments : [],
    project_manager: values.project_manager.map((item: any) => ({
      user: item.user,
      isActive: item.isActive
    })),
    followers: values.followers.map((item: any) => ({
      user: item.user,
      isActive: item.isActive
    })),
    team_members: values.team_members.map((item: any) => ({
      user: item.user,
      isActive: item.isActive
    })),
    customers: values.customers.map((item: any) => ({
      user: item.user,
      isActive: item.isActive
    })),
    priority:
      ProjectPrioties.find((item: any) => item.value === values.priority) ||
      ProjectPrioties[0],
    status:
      projectStatus.find((item: any) => item.value === values.status) ||
      projectStatus[0],
    startDate: values.startDate ? new Date(values.startDate) : new Date(),
    endDate: values.endDate ? new Date(values.endDate) : new Date(),
    dueDate: values.dueDate ? new Date(values.dueDate) : new Date(),
    logo: values.logo?.url ? { file: values?.logo } : { file: [] },
    attach_files: values?.attach_files?.map((it: any) => ({
      ...it,
      file: it.file ? [it.file] : undefined,
    })),
    tags: values.tags || [],
  };
};

export const generateProjectResponse = async (val: any) => {
  // Directly use the object as it is without stringifying it
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

  // Create the dt object with the necessary transformations
  const dt = {
    ...values,
    attach_files: processedFiles,
    priority: values?.priority ? values?.priority?.value : ProjectPrioties[1].value,
    status: values?.status ? values?.status?.value : projectStatus[0].value,
    followers: getUniqueUsers(values?.followers || []),
    project_manager: getUniqueUsers(values?.project_manager || []),
    team_members: getUniqueUsers(values.team_members || []),
    customers: getUniqueUsers(values.customers || []),
    startDate: values?.startDate ? formatDate(values?.startDate, YYYYMMDD_FORMAT) : new Date(),
    endDate: values?.endDate ? formatDate(values.endDate, YYYYMMDD_FORMAT) : new Date(),
    dueDate: values?.dueDate ? formatDate(values?.dueDate, YYYYMMDD_FORMAT) : new Date(),
  };
  return dt;
};