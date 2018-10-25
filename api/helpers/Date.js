// import moment from 'moment-timezone';

import moment from 'moment';
import tz from 'moment-timezone';

const debug = require('debug')('ip-api:Helpers/Date');

class DateHelper {
  constructor() {
    this.dateHelper = moment;
    this.timeZone = tz;
    this.now = new Date();
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
  
  serverNow() {
      this.now = new Date();
      const utc = this.now;
      // return utc.setHours( utc.getHours() + 3);
      return utc;
  }
  
}

export default DateHelper;
