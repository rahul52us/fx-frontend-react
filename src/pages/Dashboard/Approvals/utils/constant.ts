export const getErrorMessage = (error: any) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
};


export const labelize = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());

// Fields you NEVER want in drawer
export const EXCLUDED_FIELDS = ["rowId"];
