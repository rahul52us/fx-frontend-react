export const generateTableData = (data: any[]) => {
  return data.map((item: any) => {
    const designation = Array.isArray(item.designation)
      ? item.designation?.length > 0
        ? item.designation[0].title
        : "--"
      : "--"

    return {
      ...item,
      ...item.details,
      ...item.userData,
      designation: designation,
      doj: item?.details?.doj || "--",
    };
  });
};
