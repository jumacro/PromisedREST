/**
 * Custom codes to identify various actions of the RestAPI
 *
 * */
const codes = {
  success: {
    code: 200,
    message: 'SUCCESS'
  },
  created: {
    code: 201,
    message: 'CREATED'
  },
  driverLogin: {
    code: 200,
    message: 'DRIVERLOGIN'
  },
  adminLogin: {
    code: 200,
    message: 'ADMINLOGIN'
  },
  verifyPhoneAfterCreate: {
    code: 201,
    message: 'VERIFYPHONE'
  },
  phoneNotVerified: {
    code: 422,
    message: 'VERIFYPHONE'
  },
  correctVerficationCode: {
    code: 200,
    message: 'RIGHTVCODE'
  },
  noName: {
    code: 200,
    message: 'NONAME'
  },
  noPassword: {
    code: 200,
    message: 'NOPASSWORD'
  },
  riderLogin: {
    code: 200,
    message: 'RIDERLOGIN'
  },
  emailSaved: {
    code: 200,
    message: 'EMAILSAVED'
  },
  newSocialRegistration: {
    code: 200,
    message: 'NEWSREG'
  },
  profileUpdated: {
    code: 200,
    message: 'PROFILEUPDATED'
  },
  emailSent: {
    code: 200,
    message: 'EMAILSENT'
  }

};

export default codes;
