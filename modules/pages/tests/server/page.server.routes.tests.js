'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Page = mongoose.model('Page'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, page;

/**
 * Page routes tests
 */
describe('Page CRUD tests', function () {

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

    // Save a user to the test db and create new Page
    user.save(function () {
      page = {
        name: 'Page name'
      };

      done();
    });
  });

  it('should be able to save a Page if logged in', function (done) {
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

        // Save a new Page
        agent.post('/api/pages')
          .send(page)
          .expect(200)
          .end(function (pageSaveErr, pageSaveRes) {
            // Handle Page save error
            if (pageSaveErr) {
              return done(pageSaveErr);
            }

            // Get a list of Pages
            agent.get('/api/pages')
              .end(function (pagesGetErr, pagesGetRes) {
                // Handle Page save error
                if (pagesGetErr) {
                  return done(pagesGetErr);
                }

                // Get Pages list
                var pages = pagesGetRes.body;

                // Set assertions
                (pages[0].user._id).should.equal(userId);
                (pages[0].name).should.match('Page name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Page if not logged in', function (done) {
    agent.post('/api/pages')
      .send(page)
      .expect(403)
      .end(function (pageSaveErr, pageSaveRes) {
        // Call the assertion callback
        done(pageSaveErr);
      });
  });

  it('should not be able to save an Page if no name is provided', function (done) {
    // Invalidate name field
    page.name = '';

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

        // Save a new Page
        agent.post('/api/pages')
          .send(page)
          .expect(400)
          .end(function (pageSaveErr, pageSaveRes) {
            // Set message assertion
            (pageSaveRes.body.message).should.match('Please fill Page name');

            // Handle Page save error
            done(pageSaveErr);
          });
      });
  });

  it('should be able to update an Page if signed in', function (done) {
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

        // Save a new Page
        agent.post('/api/pages')
          .send(page)
          .expect(200)
          .end(function (pageSaveErr, pageSaveRes) {
            // Handle Page save error
            if (pageSaveErr) {
              return done(pageSaveErr);
            }

            // Update Page name
            page.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Page
            agent.put('/api/pages/' + pageSaveRes.body._id)
              .send(page)
              .expect(200)
              .end(function (pageUpdateErr, pageUpdateRes) {
                // Handle Page update error
                if (pageUpdateErr) {
                  return done(pageUpdateErr);
                }

                // Set assertions
                (pageUpdateRes.body._id).should.equal(pageSaveRes.body._id);
                (pageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pages if not signed in', function (done) {
    // Create new Page model instance
    var pageObj = new Page(page);

    // Save the page
    pageObj.save(function () {
      // Request Pages
      request(app).get('/api/pages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Page if not signed in', function (done) {
    // Create new Page model instance
    var pageObj = new Page(page);

    // Save the Page
    pageObj.save(function () {
      request(app).get('/api/pages/' + pageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', page.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Page with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Page is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Page which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Page
    request(app).get('/api/pages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Page with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Page if signed in', function (done) {
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

        // Save a new Page
        agent.post('/api/pages')
          .send(page)
          .expect(200)
          .end(function (pageSaveErr, pageSaveRes) {
            // Handle Page save error
            if (pageSaveErr) {
              return done(pageSaveErr);
            }

            // Delete an existing Page
            agent.delete('/api/pages/' + pageSaveRes.body._id)
              .send(page)
              .expect(200)
              .end(function (pageDeleteErr, pageDeleteRes) {
                // Handle page error error
                if (pageDeleteErr) {
                  return done(pageDeleteErr);
                }

                // Set assertions
                (pageDeleteRes.body._id).should.equal(pageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Page if not signed in', function (done) {
    // Set Page user
    page.user = user;

    // Create new Page model instance
    var pageObj = new Page(page);

    // Save the Page
    pageObj.save(function () {
      // Try deleting Page
      request(app).delete('/api/pages/' + pageObj._id)
        .expect(403)
        .end(function (pageDeleteErr, pageDeleteRes) {
          // Set message assertion
          (pageDeleteRes.body.message).should.match('User is not authorized');

          // Handle Page error error
          done(pageDeleteErr);
        });

    });
  });

  it('should be able to get a single Page that has an orphaned user reference', function (done) {
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

          // Save a new Page
          agent.post('/api/pages')
            .send(page)
            .expect(200)
            .end(function (pageSaveErr, pageSaveRes) {
              // Handle Page save error
              if (pageSaveErr) {
                return done(pageSaveErr);
              }

              // Set assertions on new Page
              (pageSaveRes.body.name).should.equal(page.name);
              should.exist(pageSaveRes.body.user);
              should.equal(pageSaveRes.body.user._id, orphanId);

              // force the Page to have an orphaned user reference
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

                    // Get the Page
                    agent.get('/api/pages/' + pageSaveRes.body._id)
                      .expect(200)
                      .end(function (pageInfoErr, pageInfoRes) {
                        // Handle Page error
                        if (pageInfoErr) {
                          return done(pageInfoErr);
                        }

                        // Set assertions
                        (pageInfoRes.body._id).should.equal(pageSaveRes.body._id);
                        (pageInfoRes.body.name).should.equal(page.name);
                        should.equal(pageInfoRes.body.user, undefined);

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
      Page.remove().exec(done);
    });
  });
});
