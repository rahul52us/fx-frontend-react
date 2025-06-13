export const projectStatus : any = [
    { value: "backlog", label: "BackLog" },
    { value: "todo", label: "Todo" },
    { value: "inProgress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "complete", label: "Completed" },
]

export const ProjectPrioties : any = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

export const initialValuesOfProjects : any = {
    deleteAttachments : [],
    project_name: "",
    subtitle: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    dueDate: new Date(),
    priority: ProjectPrioties[1],
    followers: [],
    team_members: [],
    customers: [],
    project_manager: [],
    status: projectStatus[0],
    attach_files: [],
    logo : {file : []},
    tags : []
}