function isSameDate(date1, date2) {
    return (date1.getDay() == date2.getDay()
        && date1.getMonth() == date2.getMonth()
        && date2.getFullYear() == date2.getFullYear());
}

export { isSameDate }