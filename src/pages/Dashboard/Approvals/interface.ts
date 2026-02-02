export interface ApprovalItem<T = any> {
  rowId: string;
  original: T;
  updated: Partial<T>;
}

export interface FieldConfig<T = any> {
  key: keyof T;
  label: string;
  type?: "text" | "number" | "currency" | "date" | "custom";
  render?: (value: any) => React.ReactNode;
  hideIfUnchanged?: boolean;
}

export interface SectionConfig<T = any> {
  title: string;
  fields: FieldConfig<T>[];
}

export const hasChanged = (a: any, b: any) =>
  JSON.stringify(a) !== JSON.stringify(b);

export interface ApprovalDrawerProps<T> {
  item: ApprovalItem<T> | any;
  sections: SectionConfig<T>[];
  isOpen: boolean;
  onClose: () => void;
  onApprove: (rowId: string) => void;
  onReject: (rowId: string) => void;
  isSubmitting?: boolean;
  hideActions?: boolean;
}
