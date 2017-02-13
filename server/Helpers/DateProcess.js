import Moment from 'moment';

class DateProcess {

    constructor(date) {
        this.date = date;
                
    }

    _getRelativeDate(date) {
        return date.fromNow();
    }

    _getFormatedDate(date, format) {
        return date.format(format);
    }

    getDate() {
        let dateNow = Moment(new Date());
        let dateComp = Moment(this.date);
        if(dateNow.diff(dateComp, 'days') < 1) {
            this.date = this._getRelativeDate(dateComp);
        } else {
            this.date = this._getFormatedDate(dateComp,'DD/MM/YY');
        }
        return this.date;
    }
}

export default DateProcess;