import { YYYYMMDD_FORMAT, formatDate } from "../../../../../config/constant/dateUtils";
import { getUniqueUsers, readFileAsBase64 } from "../../../../../config/constant/function";
import { categoryTypes,  travelModes, tripTypes } from "./constant";
import {
  AdditionalExpense,
  TravelDetails,
} from "./interface";

export const generateTableData = (data: any[]) => {
  return data.map((item: any) => ({
    ...item,
    ...item.profileDetails[0],
    ...item.userData,
  }));
};

export const generateFormError = (errors: any, parent : any, type: string, index: number) => {
  if(errors?.[parent]?.[index]?.[type]){
    return errors?.[parent]?.[index]?.[type];
  }else{
    return undefined
  }
}

export const generateTripResponse = async (data: any) => {
  if (Array.isArray(data?.thumbnail) && data.thumbnail?.length) {
    const buffer = await readFileAsBase64(data.thumbnail[0]);
    const fileData = {
      buffer: buffer,
      filename: data.thumbnail[0].name,
      type: data.thumbnail[0].type,
    };
    data.thumbnail = fileData;
  }

  const processedFiles = await Promise.all(
    data.attach_files.map(async (item: any) => {
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

  const updatedTravelDetails = data.travelDetails.map(
    (item: TravelDetails) => {
      return({
      ...item,
      travelMode: item?.travelMode?.value || "",
      startDate: item?.startDate ? formatDate(item?.startDate,YYYYMMDD_FORMAT) : "",
      endDate: item?.endDate ? formatDate(item?.endDate,YYYYMMDD_FORMAT) : "",
      isAccommodation:item.isAccommodation === "false" ? false : true,
      isCab:item.isCab === "false" ? false : true
    })}
  );
  const type = data.type ? data?.type?.value : tripTypes[0].value;
  const updatedAdditionalExpense = data.additionalExpenses?.map(
    (item: AdditionalExpense) => ({
      ...item,
      type: item?.type?.value || "",
    })
  ) || [];
  const updatedData = {
    ...data,
    attach_files:processedFiles,
    type: type,
    participants: getUniqueUsers(data?.participants || []),
    travelDetails: updatedTravelDetails,
    additionalExpenses: updatedAdditionalExpense,
  };
  return updatedData;
};


export const generateEditInitialValues = (data : any) => {
  const updatedTravelDetails = data?.travelDetails?.map(
    (item: TravelDetails) => {
      let td : any = travelModes.filter((it : any) => it.value === item.travelMode)
      return({
      ...item,
      travelMode: item?.travelMode ? td.length ? td[0] : undefined :  undefined,
      startDate: item?.startDate ? new Date(item?.startDate) : new Date(),
      endDate: item?.endDate ? new Date(item?.endDate) : new Date(),
      isAccommodation:String(item.isAccommodation),
      isCab:String(item.isCab)
    })
}) || [];


  const updatedAdditionalExpense = data?.additionalExpenses?.map(
    (item: AdditionalExpense) => {
      let dt = categoryTypes.filter((it : any) => it.value === item.type)
      return ({
      ...item,
      type: dt.length ? dt[0] : undefined,
    })
}) || [];

  const {createdBy, ...rest} = data
  const updatedData = {
    ...rest,
    deleteAttachments:[],
    attach_files: data?.attach_files ? data?.attach_files?.map((it: any) => ({
      ...it,
      file: it.file ? [it.file] : undefined,
    })) : [],
    type: tripTypes.find((it : any) => it.value === data.type) || tripTypes[0],
    travelDetails: updatedTravelDetails,
    additionalExpenses: updatedAdditionalExpense,
    participants: data.participants.map((item: any) => ({
      user: item.user,
      isActive: item.isActive
    }))};
  return updatedData;
}

