function dateSuffix(date) {
  let dateObj = date;
  if (/1/.test(parseInt((dateObj + '').charAt(0), 10))) {
    return 'th';
  }
  dateObj = parseInt((dateObj + '').charAt(1), 10);
  return dateObj === 1
    ? 'st'
    : dateObj === 2
    ? 'nd'
    : dateObj === 3
    ? 'rd'
    : 'th';
}

const DateConverter = {
  calendarFormat: function(dateObj) {
    //YYYY-MM-DD
    let month = '' + (dateObj.getMonth() + 1);
    let day = '' + dateObj.getDate();
    const year = dateObj.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  },
  dateString: function(dateObj) {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayOfWeek = weekday[dateObj.getDay()];

    const dayOfMonth =
      dateObj.getDate() < 10
        ? '0' + dateObj.getDate() + dateSuffix(dateObj)
        : dateObj.getDate() + dateSuffix(dateObj);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const curMonth = months[dateObj.getMonth()];
    return `${dayOfWeek}, ${curMonth} ${dayOfMonth}`;
  },
  timeString: function() {

  }
}

export default DateConverter;
