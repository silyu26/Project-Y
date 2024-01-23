function parseNumberFromString(str) {
    let num = parseInt(str);

    if (!isNaN(num)) {
        return num;
    } else {
        console.log("Invalid value found while number is required:" + str);
        return 0;
    }
}

export { parseNumberFromString }