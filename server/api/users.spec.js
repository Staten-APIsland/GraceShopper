// /* global describe beforeEach it */

// const {expect} = require('chai');
// const request = require('supertest');
// const db = require('../db');
// const app = require('../index');

// const User = db.model('user');

// describe('User routes', () => {
//   beforeEach(() => db.sync({force: true}));

//   describe('/api/users/', () => {
//     const lancelotEmail = 'lance@roundtable.com';

//     beforeEach(() =>
//       User.create({
//         email: lancelotEmail
//       })
//     );

//     it('GET /api/users', async () => {
//       const res = await request(app)
//         .get('/api/users')
//         .expect(200);

//       expect(res.body).to.be.an('array');
//       expect(res.body[0].email).to.be.equal(lancelotEmail);
//     });
//   }); // end describe('/api/users')
// }); // end describe('User routes')
