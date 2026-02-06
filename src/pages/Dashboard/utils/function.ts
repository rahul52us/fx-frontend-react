export const pickMatchedFields = (
  original: any,
  updated: any,
  rowId: string
) => {
  const filteredOriginal = Object.keys(updated).reduce((acc: any, key) => {
    if (original?.hasOwnProperty(key)) {
      acc[key] = original[key];
    }
    return acc;
  }, {});

  return {
    original: { ...filteredOriginal, rowId },
    updated: { ...updated, rowId },
  };
};
