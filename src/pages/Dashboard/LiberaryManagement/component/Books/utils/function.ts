
export const generateBookInitialValues = (data: any = {}, categoryData?: any) => {
  const categories = categoryData
    ? [{ label: categoryData?.title, value: categoryData?._id }]
    : data.categories ? Array.isArray(data?.categories)
    ? data.categories.map((item : any) => ({label : item.title, value : item._id}))
    : [] : [];

  return {
    title: data.title || "",
    author: data.author || "",
    categories,
    publisher: data.publisher || "",
    isbn: data.isbn || "",
    publishedDate: data.publishedDate ? new Date(data.publishedDate) : undefined,
    numberOfPages: data.numberOfPages || undefined,
    availableCopies: data.availableCopies || undefined,
    ratings: data.ratings || undefined,
    totalCopies: data.totalCopies || undefined,
    language: Array.isArray(data.language)
      ? data.language.map((item: any) => ({ label: item, value: item }))
      : [],
    tags: data.tags || [],
    edition: data.edition || undefined,
    description: data.description || undefined,
    coverImage: data.coverImage?.url
      ? { file: data.coverImage }
      : { file: [] },
  };
};


export const generateBookCategoryInitialValues = (data?: any) => {
  return {
    title: data?.title || "",
    description: data?.description || undefined,
    coverImage: data?.coverImage?.url
      ? { file: data.coverImage }
      : { file: [] },
  };
};

export const generateSendBookResponse = (data: any) => {
  return {
    ...data,
    categories : data?.categories?.map((it : any) => it.value),
    language: data.language.map((it: any) => it.value),
  };
};

export const generateSendBookCategoryResponse = (data: any) => {
  return {
    ...data,
  };
};
