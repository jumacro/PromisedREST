/** Helpers */

import ResponseHelper from '../helpers/ResponseObject';
import ErrorHelper from '../helpers/ErrorHandler';

const debug = require('debug')('promised-rest:Controller/App');



class Index {

  constructor(modelObj) {
    this.ResponseHelper = ResponseHelper;
    this.ErrorHelper = ErrorHelper;
    this.model = modelObj;
  }

  _createResponse(responseHandler, resultObj) {
    return responseHandler.status(resultObj.codeObj.code).json(
      new this.ResponseHelper(
        resultObj.codeObj.code,
        resultObj.codeObj.message,
        resultObj.data
      )
    );
  }

  _throwError(next, errObj) {
    const err = new this.ErrorHelper(errObj);
    return next(err);
  }

}

export default Index;
