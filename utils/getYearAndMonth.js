function getYearAndMonth(isoString) {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date(isoString);
    const year = date.getFullYear().toString();
    const month = monthNames[date.getMonth()]; // Get the three-letter month abbreviation
    return { year, month };
}
module.exports = {
    getYearAndMonth
};
