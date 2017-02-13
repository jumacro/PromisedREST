import User from '../Models/User';

/**
 * Create user
 */

function create(req, res, next) {
  const params = req.body;

  User.add(params)
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
}

/**
 * Update user
 */
function update(req, res, next) {
  const userId = req.params._id;
  const updateBody = req.body;
  const queryParam = {
            _id : userId
        };
  User.edit(queryParam, updateBody)
      .then(updatedUser => res.json(updatedUser))
      .catch(e => next(e));
}

/**
 * Get user list.
 * @returns {User[]}
 */

function getAll(req, res, next) {
  // const { limit = 50, skip = 0 } = req.query;
  User.get({})
      .then(users => res.json(users))
      .catch(e => next(e));
}

/**
 * Get user by its _id.
 * @returns {User{}}
 */

function getById(req, res, next) {
  const queryParam = {
    _id: req.params._id
  };

  User.getOne(queryParam)
      .then(user => res.json(user))
      .catch(e => next(e));
}



/** Let the user login */
function login(req, res, next) {
  const param = req.body;
  const queryParam = { chat_name : param.chat_name };
  User.getOne(queryParam)
      .then((user) => {
        if(user) {
          res.json(user);
        } else {
          res.json('Wrong username! Please retry');
        }

      })
      .catch((e) => next(e))

}

export default { 
    create, 
    update, 
    getAll, 
    getById, 
    login
};
