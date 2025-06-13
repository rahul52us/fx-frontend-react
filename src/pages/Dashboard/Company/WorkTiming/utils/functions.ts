export const getInitialWorkTimingValues = (data : any) => {
    return data.map((item : any) => ({
        ...item,
        daysOfWeek : item.daysOfWeek.map((day : any) => day),
        endTime : item.endTime,
        startTime : item.startTime
    }))
}