export const getInitialWorkTimingValues = (data : any) => {
    return data.map((item : any) => ({
        daysOfWeek : item.daysOfWeek.map((day : any) => ({label : day, value : day})),
        endTime : {label : item.endTime , value : item.endTime},
        startTime : {label : item.startTime, value : item.startTime}
    }))
}