import mongoose from 'mongoose';
import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../app';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## User APIs', () => {
  let user = {
    first_name: 'User A'
  };

  describe('# POST /v1.0/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/v1.0/users')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.first_name).to.equal(user.first_name);
          expect(res.body.last_name).to.equal(user.last_name);
          expect(res.body.username).to.equal(user.username);
          expect(res.body.password).to.equal(user.password);
          user = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /v1.0/users/:user_id', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/v1.0/users/${user._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal(user.name);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/v1.0/users/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /v1.0/users/:user_id', () => {
    it('should update user details', (done) => {
      user.name = 'User A1';
      console.log(user._id);
      request(app)
        .put(`/v1.0/users/${user._id}`)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).to.equal('User A1');
          done();
        })
        .catch(done);
    });
  });

  

  describe('# GET /v1.0/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/v1.0/users')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  
});
