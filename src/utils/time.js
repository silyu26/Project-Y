function isSameDate(date1, date2) {
    //TODO: currently timestamp in pod doesnt correlate with timestamp of data

    return true
    /** 
    return (date1.getDay() == date2.getDay()
        && date1.getMonth() == date2.getMonth()
        && date2.getFullYear() == date2.getFullYear());*/
}

export { isSameDate }