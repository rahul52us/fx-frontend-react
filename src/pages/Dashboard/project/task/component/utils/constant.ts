export const taskStatus : any = [
    { value: "backlog", label: "BackLog" },
    { value: "toDo", label: "Todo" },
    { value: "inProgress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "complete", label: "Completed" },
]

export const activeStatus : any = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
]

export const taskPrioties : any = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

export const initialValuesOfTask : any = {
    deleteAttachments : [],
    title: "",
    description: "",
    isActive:activeStatus[0],
    startDate: new Date(),
    endDate: new Date(),
    dueDate: new Date(),
    priority: taskPrioties[1],
    reminders : new Date(),
    followers: [],
    dependencies:[],
    team_members: [],
    customers: [],
    assigner:undefined,
    project_manager: [],
    status: taskStatus[0],
    attach_files : []
}