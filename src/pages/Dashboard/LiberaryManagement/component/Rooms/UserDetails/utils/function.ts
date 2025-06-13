export const generateTableData = (data: any[]) => {
    return data.map((item: any) => ({
      ...item,
      ...item.profileDetails[0],
      ...item.userData,
    }));
  };