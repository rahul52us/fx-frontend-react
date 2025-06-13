interface ManagerData {
  name: string;
  code: string;
  username: string;
  designation: string;
}

const generateManagerData = (data: any[]): ManagerData[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item: any): ManagerData => {
    const userData = item.userData
    const designation = Array.isArray(item.designation) && item.designation.length > 0 ? item.designation[0]?.title || '--' : '--';

    return {
      name: userData?.name || '--',
      code: userData?.code || '--',
      username: userData?.username || '--',
      designation: designation,
    };
  });
};

export { generateManagerData };
