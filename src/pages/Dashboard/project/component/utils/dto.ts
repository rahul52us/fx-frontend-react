export interface PriorityObjectI {
  label: string;
  value: string;
}

export interface StatusObjectI {
  label: string;
  value: string;
}

export interface ProjectFormValuesI {
  project_name: string;
  subtitle: string;
  description: string;
  startDate: any | "";
  endDate: any | "";
  dueDate: any | "";
  priority: any;
  followers: any[];
  team_members: any[];
  customers: any[];
  project_manager: any[];
  status: any;
  attach_files: any[];
}
