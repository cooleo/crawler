'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Queue = mongoose.model('Queue'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, queue;

/**
 * Queue routes tests
 */
describe('Queue CRUD tests', function () {

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

    // Save a user to the test db and create new Queue
    user.save(function () {
      queue = {
        name: 'Queue name'
      };

      done();
    });
  });

  it('should be able to save a Queue if logged in', function (done) {
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

        // Save a new Queue
        agent.post('/api/queues')
          .send(queue)
          .expect(200)
          .end(function (queueSaveErr, queueSaveRes) {
            // Handle Queue save error
            if (queueSaveErr) {
              return done(queueSaveErr);
            }

            // Get a list of Queues
            agent.get('/api/queues')
              .end(function (queuesGetErr, queuesGetRes) {
                // Handle Queue save error
                if (queuesGetErr) {
                  return done(queuesGetErr);
                }

                // Get Queues list
                var queues = queuesGetRes.body;

                // Set assertions
                (queues[0].user._id).should.equal(userId);
                (queues[0].name).should.match('Queue name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Queue if not logged in', function (done) {
    agent.post('/api/queues')
      .send(queue)
      .expect(403)
      .end(function (queueSaveErr, queueSaveRes) {
        // Call the assertion callback
        done(queueSaveErr);
      });
  });

  it('should not be able to save an Queue if no name is provided', function (done) {
    // Invalidate name field
    queue.name = '';

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

        // Save a new Queue
        agent.post('/api/queues')
          .send(queue)
          .expect(400)
          .end(function (queueSaveErr, queueSaveRes) {
            // Set message assertion
            (queueSaveRes.body.message).should.match('Please fill Queue name');

            // Handle Queue save error
            done(queueSaveErr);
          });
      });
  });

  it('should be able to update an Queue if signed in', function (done) {
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

        // Save a new Queue
        agent.post('/api/queues')
          .send(queue)
          .expect(200)
          .end(function (queueSaveErr, queueSaveRes) {
            // Handle Queue save error
            if (queueSaveErr) {
              return done(queueSaveErr);
            }

            // Update Queue name
            queue.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Queue
            agent.put('/api/queues/' + queueSaveRes.body._id)
              .send(queue)
              .expect(200)
              .end(function (queueUpdateErr, queueUpdateRes) {
                // Handle Queue update error
                if (queueUpdateErr) {
                  return done(queueUpdateErr);
                }

                // Set assertions
                (queueUpdateRes.body._id).should.equal(queueSaveRes.body._id);
                (queueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Queues if not signed in', function (done) {
    // Create new Queue model instance
    var queueObj = new Queue(queue);

    // Save the queue
    queueObj.save(function () {
      // Request Queues
      request(app).get('/api/queues')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Queue if not signed in', function (done) {
    // Create new Queue model instance
    var queueObj = new Queue(queue);

    // Save the Queue
    queueObj.save(function () {
      request(app).get('/api/queues/' + queueObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', queue.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Queue with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/queues/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Queue is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Queue which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Queue
    request(app).get('/api/queues/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Queue with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Queue if signed in', function (done) {
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

        // Save a new Queue
        agent.post('/api/queues')
          .send(queue)
          .expect(200)
          .end(function (queueSaveErr, queueSaveRes) {
            // Handle Queue save error
            if (queueSaveErr) {
              return done(queueSaveErr);
            }

            // Delete an existing Queue
            agent.delete('/api/queues/' + queueSaveRes.body._id)
              .send(queue)
              .expect(200)
              .end(function (queueDeleteErr, queueDeleteRes) {
                // Handle queue error error
                if (queueDeleteErr) {
                  return done(queueDeleteErr);
                }

                // Set assertions
                (queueDeleteRes.body._id).should.equal(queueSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Queue if not signed in', function (done) {
    // Set Queue user
    queue.user = user;

    // Create new Queue model instance
    var queueObj = new Queue(queue);

    // Save the Queue
    queueObj.save(function () {
      // Try deleting Queue
      request(app).delete('/api/queues/' + queueObj._id)
        .expect(403)
        .end(function (queueDeleteErr, queueDeleteRes) {
          // Set message assertion
          (queueDeleteRes.body.message).should.match('User is not authorized');

          // Handle Queue error error
          done(queueDeleteErr);
        });

    });
  });

  it('should be able to get a single Queue that has an orphaned user reference', function (done) {
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

          // Save a new Queue
          agent.post('/api/queues')
            .send(queue)
            .expect(200)
            .end(function (queueSaveErr, queueSaveRes) {
              // Handle Queue save error
              if (queueSaveErr) {
                return done(queueSaveErr);
              }

              // Set assertions on new Queue
              (queueSaveRes.body.name).should.equal(queue.name);
              should.exist(queueSaveRes.body.user);
              should.equal(queueSaveRes.body.user._id, orphanId);

              // force the Queue to have an orphaned user reference
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

                    // Get the Queue
                    agent.get('/api/queues/' + queueSaveRes.body._id)
                      .expect(200)
                      .end(function (queueInfoErr, queueInfoRes) {
                        // Handle Queue error
                        if (queueInfoErr) {
                          return done(queueInfoErr);
                        }

                        // Set assertions
                        (queueInfoRes.body._id).should.equal(queueSaveRes.body._id);
                        (queueInfoRes.body.name).should.equal(queue.name);
                        should.equal(queueInfoRes.body.user, undefined);

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
      Queue.remove().exec(done);
    });
  });
});
