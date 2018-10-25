/**
 * Custom codes to identify various actions of the RestAPI
 *
 * */
const codes = {
  http: {
    success: {
      read: {
        code: 200,
        message: 'SUCCESS'
      },
      created: {
        code: 201,
        message: 'CREATED'
      },
      update: {
        code: 200,
        message: 'UPDATED'
      },
      activate: {
        code: 200,
        message: 'ACTIVATED'
      },
      deactivate: {
        code: 200,
        message: 'DEACTIVATED'
      },
      delete: {
        code: 200,
        message: 'DELETED'
      }
    },
    error: {
      server: {
        code: 500,
        message: 'SERVERERROR'
      },
      auth: {
        unauth: {
          code: 401,
          message: 'UNAUTHORIZED'
        },
        invalidCred: {
          code: 400,
          message: 'WRONGCREDS'
        },
        badInput: {
          code: 400,
          message: 'BADINPUT'
        },
        loggedIn: {
          code: 400,
          message: 'LOGGEDIN'
        },
        locked: {
          code: 401,
          message: 'LOCKED'
        }
      },
      validation: {
        badData: {
          code: 400,
          message: 'BADINPUT'
        },
        exists: {
          code: 400,
          message: 'EXISTS'
        },
      }
    },
  },
  actionCode: {
    read: 200,
    created: 201,
    update: 202,
    delete: 203,
    login: 204,
    logout: 205,
    activate: 206,
    deactivate: 207
  }

};

export default codes;
