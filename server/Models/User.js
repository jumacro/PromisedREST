import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../Helpers/APIError';
import Lib from '../Helpers/Lib';

/**
 * Dependencies 
 */

import Room  from './Room';



/**
* User schema
* Stores the registered user data
* @copyright: Copyright(c) 2017 
* @author: Mithun Das
*
*/

/** Initialize the debugger */

const debug = require('debug')('PromisedREST:index');

let resObject = {
    err: false,
    data: false
};

/** Set primary objects */

const Schema   = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/** User schema with validation rules */

const User = new Schema({
    first_name: {
        type: String, 
        required: [true, 'First name is required'],
    },
    last_name: {
        type: String, 
        required: [true, 'Last name is required'],
    },
    username: {
        type: String, 
        required: [true, 'Username/Chatname is required'],
        unique: [true, 'Username/Chatname already taken'],
    },
    password: {
        type: String, 
        required: [true, 'Username/Chatname is required'],
        unique: [true, 'Username/Chatname already taken'],
    },
    avatar_url: {
        type: String, 
        default: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png'
    },
    is_login: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});


/**
 * - pre-save hooks
 * - custom validations
 * - virtuals
 * - indexes
 */

/**
 * Methods
 */
User.method({
});

/**
 * Statics
 */
User.statics = {
  /**
   * Add user
   * @params reqParams
   * @return Promise
   */
  add(reqParams) {

      let newUser = {};

      for (let [key,value] of Lib.objectEntries(reqParams)) {
          
          newUser[key] = value;
      }

      const user = new this(newUser);

      return user.save();
  },

  /**
   * Edit user
   * @params reqParams
   * @params reqBody
   * @return Promise
   */

  edit(reqParams, reqBody) {

      const options = {   
          upsert: true,
          new: true,
          runValidators: true
      };
      let updateBody = {};
      for (let [key,value] of Lib.objectEntries(reqBody)) {
          
          updateBody[key] = value;
      }
      return this.findOneAndUpdate(reqParams, updateBody, options).exec();

  },

  /** 
   * Get array of user objects
   * 
   * @params reqParams - Json Object designed to query the Collection
   * @return Promise	
   * 
   */

  get(reqParams, recursive = 1) {
      const Model = this;
      const queryObject = Model.find(reqParams)
                               .lean();
      if(recursive === 0) {
          return queryObject.exec();
      } 
      if(recursive === 1) {
          return queryObject.populate({
                                path: '_company_id'
                            })
                            .exec();
      }
  },

   /** 
   * Get a user object
   * 
   * @params reqParams - Json Object designed to query the Collection
   * @return Promise
   * 
   */

  getOne(reqParams, recursive = 1) {
      const Model = this;
      const queryObject = Model.findOne(reqParams)
                               .lean();
      if(recursive === 0) {
          return queryObject.exec();
      } 
      if(recursive === 1) {
          return queryObject.populate({
                                path: '_company_id'
                            })
                            .exec();
      }
  },

    
};


/**
 * @typedef User
 */
export default mongoose.model('User', User);
