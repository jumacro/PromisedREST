import Joi from 'joi';

export default {
  
  /** Users Model */
  // Create user
  createUser: {
    body: {
      _company_id: Joi.string().required(),
      chat_name: Joi.string().required(),
      full_name: Joi.string().required(),
      avatar_url: Joi.string().uri()
    }
  },
  // Update user
  updateUser: {
    body: {
      chat_name: Joi.string().required(),
      full_name: Joi.string().required(),
      avatar_url: Joi.string().uri()
    },
    params: {
      _id: Joi.string().hex().required()
    }
  },
  
};
