const getDay = (date : string) => {
    if (date) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dates = new Date(date);
        const dayIndex = dates.getDay();
        return daysOfWeek[dayIndex];
    } else {
        return "--";
    }
}

export const generateResponse = (data : any) => {
    return data.map((item : any) => ({...item,day : getDay(item.date) }))
}