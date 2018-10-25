/** Modules */
/** Base controller */
import Base from './base';
/** Models */
import ActionLog from '../models/ActionLog';

import codes from '../../constants/codes';


const debug = require('debug')('ip-api:Controller/Log');

/** create model object */
const models = {
  logModel: ActionLog
};

class Users extends Base {

  constructor() {
    super(models);
  }
  
  /** ADMIN FUNCTION **/
  
  /** USER FUNCTIONS **/
  
  adminUserCreate(creatorId, recordId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.created,
      module: 'ADMIN',
      moduleId: recordId,
      userId: creatorId,
      notes: `ADMIN-${creatorId} created User ${recordId}`
    }
    this.model.logModel.add(logParams);
  }
  
  adminMerchantCreate(creatorId, recordId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.created,
      module: 'MERCHANT',
      moduleId: recordId,
      userId: creatorId,
      notes: `ADMIN-${creatorId} created Merchant ${recordId}`
    }
    this.model.logModel.add(logParams);
  }
  
  adminCustomerCreate(creatorId, recordId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.created,
      module: 'CUSTOMER',
      moduleId: recordId,
      userId: creatorId,
      notes: `ADMIN-${creatorId} created Customer ${recordId}`
    }
    this.model.logModel.add(logParams);
  }
  
  activateAdmin(userId, activerId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.activate,
      module: 'USER',
      moduleId: userId,
      userId: activerId,
      notes: `${activerId} activated ${userId}`
    };
    this.model.logModel.add(logParams);
  }
  
  deactivateAdmin(userId, deactiverId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.deactivate,
      module: 'USER',
      moduleId: userId,
      userId: deactiverId,
      notes: `${deactiverId} deactivated ${userId}`
    };
    this.model.logModel.add(logParams);
  }
  
  activateMerchant(userId, activerId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.activate,
      module: 'MERCHANT',
      moduleId: userId,
      userId: activerId,
      notes: `${activerId} activated ${userId}`
    };
    this.model.logModel.add(logParams);
  }
  
  deactivateMerchant(userId, deactiverId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.deactivate,
      module: 'MERCHANT',
      moduleId: userId,
      userId: deactiverId,
      notes: `${deactiverId} deactivated ${userId}`
    };
    this.model.logModel.add(logParams);
  }
  
  activateCustomer(userId, activerId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.activate,
      module: 'CUSTOMER',
      moduleId: userId,
      userId: activerId,
      notes: `${activerId} activated ${userId}`
    };
    this.model.logModel.add(logParams);
  }
  
  deactivateCustomer(userId, deactiverId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.deactivate,
      module: 'CUSTOMER',
      moduleId: userId,
      userId: deactiverId,
      notes: `${deactiverId} deactivated ${userId}`
    };
    this.model.logModel.add(logParams);
  }
  
  /** AUTH FUNCTIONS **/
  
  adminLogin(loggedInUserId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.login,
      module: 'USER',
      userId: loggedInUserId,
      notes: `${loggedInUserId} logged in`
    }
    this.model.logModel.add(logParams);
  }
  
  adminLogout(loggedInUserId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.logout,
      module: 'USER',
      userId: loggedInUserId,
      notes: `${loggedInUserId} logged out`
    }
    this.model.logModel.add(logParams);
  }
  
  /**** CATEGORY MODULE **/
  
  adminCategoryCreate(creatorId, recordId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.created,
      module: 'CATEGORY',
      moduleId: recordId,
      userId: creatorId,
      notes: `ADMIN-${creatorId} created Category ${recordId}`
    }
    this.model.logModel.add(logParams);
  }
  
  adminCategoryUpdated(updatorId, recordId) {
    const logParams = {
      actionType: 'ADMIN',
      actionCode: codes.actionCode.update,
      module: 'CATEGORY',
      moduleId: recordId,
      userId: updatorId,
      notes: `ADMIN-${updatorId} updated Category ${recordId}`
    }
    this.model.logModel.add(logParams);
  }
  
  activateCategory(userType, recordId, activerId) {
    const logParams = {
      actionType: userType,
      actionCode: codes.actionCode.activate,
      module: 'CATEGORY',
      moduleId: recordId,
      userId: activerId,
      notes: `${activerId} activated ${recordId}`
    };
    this.model.logModel.add(logParams);
  }
  
  deactivateCategory(userType, recordId, deactiverId) {
    const logParams = {
      actionType: userType,
      actionCode: codes.actionCode.activate,
      module: 'CATEGORY',
      moduleId: recordId,
      userId: deactiverId,
      notes: `${deactiverId} activated ${recordId}`
    };
    this.model.logModel.add(logParams);
  }
  
  
  
  merchantLogin(loggedInUserId) {
    const logParams = {
      actionType: 'MERCHANT',
      actionCode: codes.actionCode.login,
      module: 'USER',
      userId: loggedInUserId,
      notes: `${loggedInUserId} logged in`
    }
    this.model.logModel.add(logParams);
  }
  
  merchantLogout(loggedInUserId) {
    const logParams = {
      actionType: 'MERCHANT',
      actionCode: codes.actionCode.logout,
      module: 'USER',
      userId: loggedInUserId,
      notes: `${loggedInUserId} logged out`
    }
    this.model.logModel.add(logParams);
  }
  
  merchantCategoryCreate(creatorId, recordId) {
    const logParams = {
      actionType: 'MERCHANT',
      actionCode: codes.actionCode.created,
      module: 'CATEGORY',
      moduleId: recordId,
      userId: creatorId,
      notes: `MERCHANT-${creatorId} created Category ${recordId}`
    }
    this.model.logModel.add(logParams);
  }
  
  merchantCategoryEdit(editorId, recordId) {
    const logParams = {
      actionType: 'MERCHANT',
      actionCode: codes.actionCode.edited,
      module: 'CATEGORY',
      moduleId: recordId,
      userId: editorId,
      notes: `MERCHANT-${editorId} updated Category ${recordId}`
    }
    this.model.logModel.add(logParams);
  }
  
  
  customerLogin(loggedInUserId) {
    const logParams = {
      actionType: 'CUSTOMER',
      actionCode: codes.actionCode.login,
      module: 'USER',
      userId: loggedInUserId,
      notes: `${loggedInUserId} logged in`
    }
    this.model.logModel.add(logParams);
  }
  
  customerLogout(loggedInUserId) {
    const logParams = {
      actionType: 'CUSTOMER',
      actionCode: codes.actionCode.logout,
      module: 'USER',
      userId: loggedInUserId,
      notes: `${loggedInUserId} logged out`
    }
    this.model.logModel.add(logParams);
  }
}


export default Users;
