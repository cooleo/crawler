'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Seed = mongoose.model('Seed'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, seed;

/**
 * Seed routes tests
 */
describe('Seed CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Seed
    user.save(function () {
      seed = {
        name: 'Seed name'
      };

      done();
    });
  });

  it('should be able to save a Seed if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Seed
        agent.post('/api/seeds')
          .send(seed)
          .expect(200)
          .end(function (seedSaveErr, seedSaveRes) {
            // Handle Seed save error
            if (seedSaveErr) {
              return done(seedSaveErr);
            }

            // Get a list of Seeds
            agent.get('/api/seeds')
              .end(function (seedsGetErr, seedsGetRes) {
                // Handle Seed save error
                if (seedsGetErr) {
                  return done(seedsGetErr);
                }

                // Get Seeds list
                var seeds = seedsGetRes.body;

                // Set assertions
                (seeds[0].user._id).should.equal(userId);
                (seeds[0].name).should.match('Seed name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Seed if not logged in', function (done) {
    agent.post('/api/seeds')
      .send(seed)
      .expect(403)
      .end(function (seedSaveErr, seedSaveRes) {
        // Call the assertion callback
        done(seedSaveErr);
      });
  });

  it('should not be able to save an Seed if no name is provided', function (done) {
    // Invalidate name field
    seed.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Seed
        agent.post('/api/seeds')
          .send(seed)
          .expect(400)
          .end(function (seedSaveErr, seedSaveRes) {
            // Set message assertion
            (seedSaveRes.body.message).should.match('Please fill Seed name');

            // Handle Seed save error
            done(seedSaveErr);
          });
      });
  });

  it('should be able to update an Seed if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Seed
        agent.post('/api/seeds')
          .send(seed)
          .expect(200)
          .end(function (seedSaveErr, seedSaveRes) {
            // Handle Seed save error
            if (seedSaveErr) {
              return done(seedSaveErr);
            }

            // Update Seed name
            seed.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Seed
            agent.put('/api/seeds/' + seedSaveRes.body._id)
              .send(seed)
              .expect(200)
              .end(function (seedUpdateErr, seedUpdateRes) {
                // Handle Seed update error
                if (seedUpdateErr) {
                  return done(seedUpdateErr);
                }

                // Set assertions
                (seedUpdateRes.body._id).should.equal(seedSaveRes.body._id);
                (seedUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Seeds if not signed in', function (done) {
    // Create new Seed model instance
    var seedObj = new Seed(seed);

    // Save the seed
    seedObj.save(function () {
      // Request Seeds
      request(app).get('/api/seeds')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Seed if not signed in', function (done) {
    // Create new Seed model instance
    var seedObj = new Seed(seed);

    // Save the Seed
    seedObj.save(function () {
      request(app).get('/api/seeds/' + seedObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', seed.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Seed with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/seeds/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Seed is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Seed which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Seed
    request(app).get('/api/seeds/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Seed with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Seed if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Seed
        agent.post('/api/seeds')
          .send(seed)
          .expect(200)
          .end(function (seedSaveErr, seedSaveRes) {
            // Handle Seed save error
            if (seedSaveErr) {
              return done(seedSaveErr);
            }

            // Delete an existing Seed
            agent.delete('/api/seeds/' + seedSaveRes.body._id)
              .send(seed)
              .expect(200)
              .end(function (seedDeleteErr, seedDeleteRes) {
                // Handle seed error error
                if (seedDeleteErr) {
                  return done(seedDeleteErr);
                }

                // Set assertions
                (seedDeleteRes.body._id).should.equal(seedSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Seed if not signed in', function (done) {
    // Set Seed user
    seed.user = user;

    // Create new Seed model instance
    var seedObj = new Seed(seed);

    // Save the Seed
    seedObj.save(function () {
      // Try deleting Seed
      request(app).delete('/api/seeds/' + seedObj._id)
        .expect(403)
        .end(function (seedDeleteErr, seedDeleteRes) {
          // Set message assertion
          (seedDeleteRes.body.message).should.match('User is not authorized');

          // Handle Seed error error
          done(seedDeleteErr);
        });

    });
  });

  it('should be able to get a single Seed that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Seed
          agent.post('/api/seeds')
            .send(seed)
            .expect(200)
            .end(function (seedSaveErr, seedSaveRes) {
              // Handle Seed save error
              if (seedSaveErr) {
                return done(seedSaveErr);
              }

              // Set assertions on new Seed
              (seedSaveRes.body.name).should.equal(seed.name);
              should.exist(seedSaveRes.body.user);
              should.equal(seedSaveRes.body.user._id, orphanId);

              // force the Seed to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Seed
                    agent.get('/api/seeds/' + seedSaveRes.body._id)
                      .expect(200)
                      .end(function (seedInfoErr, seedInfoRes) {
                        // Handle Seed error
                        if (seedInfoErr) {
                          return done(seedInfoErr);
                        }

                        // Set assertions
                        (seedInfoRes.body._id).should.equal(seedSaveRes.body._id);
                        (seedInfoRes.body.name).should.equal(seed.name);
                        should.equal(seedInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Seed.remove().exec(done);
    });
  });
});
