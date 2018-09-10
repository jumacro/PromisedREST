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


describe('# GET /api/v2.0/drivers/', () => {
  it('get drivers', (done) => {
    request(app)
      .get('/api/v2.0/drivers/')
      .expect(httpStatus.OK)
      .then((res) => {
        done();
      })
      .catch(done);
  });
});
