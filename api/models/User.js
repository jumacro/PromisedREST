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
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isSuper: {
    type: Boolean,
    default: false
  },
  isCustomer: {
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
  },
  ip: {
    type: String,
    default: null
  }
});


User.statics = {
  /**
   * Add user
   * @params reqParams
   * @return Promise
   */
  add(reqParams) {
    const saveParams = reqParams;
    const now = new Date();
    const utc = now;
    saveParams.created = utc;
    const user = new this(saveParams);
    // debug(user);
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

  getOne(requestParams) {
    const Model = this;
    return Model.findOne(requestParams)
    .lean()
    .exec();
  },
  
  updateLogin(_id, value, logindate = null) {
    const Model = this;
    const updateObj = {
      isLoggedIn: value
    };
    if (logindate) {
      updateObj.lastLoginDate = logindate;
    }
    const setter = {
      $set: updateObj
    };
    
    return Model.updateOne({ _id }, setter)
      .then(updateObj => Promise.resolve(updateObj))
      .catch(e => Promise.reject(e));
  },
  
  editStatus(_id, value) {
    const Model = this;
    return Model.updateOne({ _id }, { isActive: value })
      .then(updateObj => Promise.resolve(updateObj))
      .catch(e => Promise.reject(e));
  },
  
  /**
   * Check if email, loginPhone exists
   * */
 checkExistance(data) {
   const Model = this;
   const match = {
    $or: [
      {
        email: data.email
      },
      {
        phone: data.phone
      }
    ]
  };
  return Model.findOne(match)
          .select('email phone')
          .lean()
          .exec();
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
