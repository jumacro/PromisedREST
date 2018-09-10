import Promise from 'bluebird';
import mongoose from 'mongoose';

import settings from '../../constants/settings';

// const driverStatusCode = statusCode.driver;

const debug = require('debug')('promised-rest:Model/User');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const User = new Schema({
  fname: {
    type: String,
    required: [true, 'First name is required'],
  },
  lname: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  username: {
    type: ObjectId,
    required: [true, 'Username is required'],
    unique: true
  },
  loginPhoneNo: {
    type: String,
    required: [true, 'Phone number is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  salt: {
    type: String,
    required: [true, 'Password is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date
  },
  lastLoginDate: {
    type: Date,
    default: null
  }
});


User.statics = {
  /**
   * Add user
   * @params reqParams
   * @return Promise
   */
  add(request) {
    const saveParams = request;
    const now = new Date();
    const utc = now;
    saveParams.created = utc;
    const user = new this(reqParams);
    debug(user);
    return user.save();
  },

  /**
   * Edit user
   * @params reqParams
   * @params reqBody
   * @return Promise
   */

  edit(reqParams, reqBody) {
    const Model = this;
    const options = {
      new: true,
      runValidators: true
    };
    // debug(reqBody);
    return Model.findOneAndUpdate(reqParams, reqBody, options)
      .lean()  
      .exec()
      .then(updateObj => Promise.resolve(updateObj))
      .catch(e => Promise.reject(e));
  },

  getA(requestParams) {
    const Model = this;
    return Model.findOne(requestParams).lean().exec();
  },

  /**
   * Get array of user objects
   *
   * @params reqParams - Json Object designed to query the Collection
   * @return Promise
   *
   */

  allusers(filters) {
    const Model = this;
    const match = {};
    let sortObj = {
      created: -1
    };
    let offset = 0;
    let limit = 100;
    if (filters) {
      if (filters.active) {
        match.isActive = true;
      }
      if (filters.inactive) {
        match.isActive = false;
      }
      if (filters.keyword) {
        const keyword = filters.keyword;
        match.keyword = new RegExp(`${keyword}`, 'i');
      }
      if (filters.userId) {
        match = {
          _id: filters.userId
        };
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
      $addFields: {
        keyword: {
          $concat: [
            "$fname",
            " ",
            "$lname",
            " ",
            "$email",
            " ",
            "$username",
          ]
        }
      }
    }, {
      $project: {
        fname: 1,
        lname: 1,
        email: 1,
        isAdmin: 1,
        isActive: 1,
        lastLoginDate: 1,
        created: 1
      }
    }, {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        users: {
          $push: '$$ROOT'
        }
      }
    }, {
      $project: {
        _id: 0,
        totalusers: 1,
        users: {
          $slice: [
            '$users',
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
 * @typedef User
 */
export default mongoose.model('User', User);
