
export const generateRoomInitialValues = (data: any = {}) => {
  return {
    title: data.title || "",
    description: data.description || undefined,
    ratings : data.ratings || undefined,
    coverImage: data.coverImage?.url
      ? { file: data.coverImage }
      : { file: [] },
  };
};

export const generateSendRoomResponse = (data: any) => {
  return {
    ...data
  };
};
