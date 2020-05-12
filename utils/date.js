function dateSuffix(date) {
  let day = date.getDate() + '';
  if (day.length < 2) {
    day = '0' + day;
  }

  if (/1/.test(parseInt(day.charAt(0), 10))) {
    return 'th';
  }

  const singleDay = parseInt(day.charAt(1), 10);
  return singleDay === 1
    ? 'st'
    : singleDay === 2
    ? 'nd'
    : singleDay === 3
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
  timeString: function(ts) {
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  },
  getUTCUnixTime: function() {
    // Always work in UTC, not the local time in the locationData
    let nowUTC = new Date().toISOString();
    return Date.parse(nowUTC);
  },
};

export default DateConverter;
