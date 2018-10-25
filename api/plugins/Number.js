// import moment from 'moment-timezone';

const debug = require('debug')('promised-rest:Plugins/Number');

class NumberPlugin {
  constructor(num) {
    this.num = num;
  }
  
  format(scale) {
    const num = this.num;
    if (!("" + num).includes("e")) {
      return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
      var arr = ("" + num).split("e");
      var sig = "";
      if (+arr[1] + scale > 0) {
        sig = "+";
      }
      return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
  }
  
}

export default NumberPlugin;
