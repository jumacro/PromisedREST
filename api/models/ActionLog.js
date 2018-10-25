import Promise from 'bluebird';
import mongoose from 'mongoose';

import settings from '../../constants/settings';

// const driverStatusCode = statusCode.driver;

const debug = require('debug')('ip-api:Model/ActionLog');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const ActionLog = new Schema({
  actionType: {
    type: String,
    default: 'SYSTEM', // 'ADMIN', 'SUBMERCHANT', 'USER', 'SUPER'
  },
  userId: {
    type: ObjectId,
    default: null,
  },
  module: {
    type: String,
    required: true
  },
  moduleId: {
    type: ObjectId,
    default: null,
  },
  actionCode: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  created: {
    type: Date
  }
});


ActionLog.statics = {
  /**
   * Add logs
   * @params reqParams
   * @return Promise
   */
  add(reqParams) {
    
    const saveParams = reqParams;
    const now = new Date();
    const utc = now;
    saveParams.created = utc;
    const log = new this(saveParams);
    // debug(log);
    return log.save();
  },

  /**
   * Get array of user objects
   *
   * @params reqParams - Json Object designed to query the Collection
   * @return Promise
   *
   */

  logs(filters) {
    const Model = this;
    const match = {};
    let sortObj = {
      created: -1
    };
    let offset = 0;
    let limit = 100;
    if (filters) {
      if (filters.actionType) {
        match.actionType = filters.actionType;
      }
      if (filters.actionCode) {
        match.actionCode = filters.actionCode;
      }
      if (filters.module) {
        match.module = filters.module;
      }
      if (filters.moduleId) {
        match.moduleId = filters.moduleId;
      }
      if (filters.offset) {
        offset = filters.offset;
      }
      if (filters.limit) {
        limit = filters.limit;
      }
    }
    const aggregation = [ {
      $sort: sortObj
    }, {
      $group: {
        _id: null,
        totalLogs: { $sum: 1 },
        logs: {
          $push: '$$ROOT'
        }
      }
    }, {
      $project: {
        _id: 0,
        totalLogs: 1,
        logs: {
          $slice: [
            '$logs',
            parseInt(offset, 10),
            parseInt(limit, 10)
          ]
        }
      }
    }];
    aggregation.options = { allowDiskUse: true };
    
    return Model.aggregate(aggregation)
                .allowDiskUse(true)
                .exec();
  },


};


/**
 * @typedef ActionLog
 */
export default mongoose.model('ActionLog', ActionLog);
