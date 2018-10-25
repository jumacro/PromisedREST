// import moment from 'moment-timezone';

import moment from 'moment';
import tz from 'moment-timezone';

const debug = require('debug')('promised-rest:Plugins/Date');

class DatePlugin {
  constructor() {
    this.dateHelper = moment;
    this.timeZone = tz;
  }

  /**
   * timeDifference --- gets the difference of 2 dates at specied unit
   * @param {DateTime} start
   * @param {DateTime} end
   * @param {String} unit 'seconds', 'hours', 'days' etc
   * @return {Number}
   */
  timeDifference(start, end, unit) {
    const dateA = this.dateHelper(start);
    const dateB = this.dateHelper(end);
    return dateB.diff(dateA, unit);
    
  }
  
  getNow() {
    return this.timeZone().tz('Asia/Istanbul').format();
  }
  
  convertTime(date) {
    return this.timeZone().tz(date, 'Asia/Istanbul').format();
  }

  /**
   * getFutureDate --- Get a Date by adding a time in specied unit with a given date
   * @param {DateTime} presentDate
   * @param {Integer} timeToAdd
   * @param {String} unit 'seconds', 'hours', 'days' etc
   * @return {Date}
   */
  getFutureDate(presentDate, timeToAdd, unit) {
    const date = this.dateHelper(presentDate);
    return date.add(timeToAdd, unit);
  }
  
  stringToDate(date) {
    return this.dateHelper(date);
  }
  
  getPresentWeekRange() {
    const self = this;
    const currentDate = self.dateHelper();

    const weekStart = currentDate.clone().startOf('isoWeek');
    const weekEnd = currentDate.clone().endOf('isoWeek');
    const firstday = new Date(self.dateHelper(weekStart).add(1, 'days').format("YYYY-MM-DD"));
    firstday.setHours(0,0,0,0);
    const lastday = new Date(self.dateHelper(weekEnd).add(0, 'days').format("YYYY-MM-DD"));
    lastday.setHours(23,59,59,999);
    return [firstday, lastday];
  }
  
  getPresentMonthRange() {
    const self = this;
    const currentDate = self.dateHelper();

    const monthStart = currentDate.clone().startOf('month');
    const monthEnd = currentDate.clone().endOf('month');
    const firstday = new Date(self.dateHelper(monthStart).add(0, 'days').format("YYYY-MM-DD"));
    firstday.setHours(0,0,0,0);
    const lastday = new Date(self.dateHelper(monthEnd).add(0, 'days').format("YYYY-MM-DD"));
    lastday.setHours(23,59,59,999);
    return [firstday, lastday];
  }
  
  getLastMonthRange() {
    const self = this;
  }
  
  getLastThirtyDaysRange() {
    const self = this;
    const today = new Date();
    const thirtyDaysAgo = new Date(self.dateHelper(today).add(-30, 'days').format("YYYY-MM-DD"));
    
    const firstday = thirtyDaysAgo;
    const lastday = today;
    return [firstday, lastday];
  }
  
  static _getDateRange(noOfDays) {
    const today = new Date();
    const dateNum = parseInt(noOfDays, 10);
    const noOfDaysAgo = new Date(today.getTime()-1000*60*60*24*dateNum);
    
    const firstday = noOfDaysAgo;
    const lastday = today;
    return [firstday, lastday];
  }
  
  static _getDateRangeV2(noOfDays) {
    const today = new Date();
    const dateNum = parseInt(noOfDays, 10);
    const thirtyDaysAgo = new Date(today.getTime()-1000*60*60*24*dateNum);
    
    const firstday = thirtyDaysAgo;
    const lastday = today;
    return [firstday, lastday];
  }
  
  getTodayRange() {
    const self = this;
    const now = new Date();
    const todayStart = now.setHours(3,0,0,0);
    const todayEnd = now.setHours(26,59,59,999);
    const formatedTodayStart = new Date(todayStart);
    const formatedTodayEnd = new Date(todayEnd);
    return [formatedTodayStart, formatedTodayEnd];
  }
  
  getStartAndEndDateofWeek(weekNum) {
    // moment([2016]).isoWeek(1).startOf('isoWeek').format('DD.MM.YYYY')
    debug(weekNum);
    const self = this;
    const thisYear = new Date().getFullYear();
    const firstday = new Date(self.dateHelper([thisYear]).isoWeek(weekNum).startOf('isoWeek').format("YYYY-MM-DD"));
    const lastday = new Date(self.dateHelper([thisYear]).isoWeek(weekNum).endOf('isoWeek').format("YYYY-MM-DD"));
    return [firstday, lastday];
  }
  
  static _secondsToTime(secs) {
      secs = Math.round(secs);
      var hours = Math.floor(secs / (60 * 60));
  
      var divisor_for_minutes = secs % (60 * 60);
      var minutes = Math.floor(divisor_for_minutes / 60);
  
      var divisor_for_seconds = divisor_for_minutes % 60;
      var seconds = Math.ceil(divisor_for_seconds);
      return `${hours}:${minutes}:${seconds}`;
  }
}

export default DatePlugin;
