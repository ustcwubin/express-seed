var models = require('../../server/models'),
  support = require('../support'),
  moment = require('moment'),
  should = require('should');

var newPost = function(callback) {
  support.createTestUser(function(err, result) {
    if (err) {
      callback(err);
    } else {
      if (!result.user) {
        return callback(new Error(result.status));
      }
      post = {
        author_id: result.user.id,
        title: 'test title - ' + moment().unix(),
        body: 'test body \r\n' + moment().unix(),
        slug: 'test-post-' + moment().valueOf(),
        status: 0,
      };
      models.Post.create(post, result.user, callback);
    }
  });
};

describe('models/post', function() {
  describe('#create()', function() {
    it('should create a post without error', function(done) {
      support.createTestUser(function(err, result) {
        should.not.exist(err);
        should.exist(result);
        should.exist(result.user);

        post = {
          author_id: result.user.id,
          title: 'test title - ' + moment().unix(),
          body: 'test body \r\n' + moment().unix(),
          slug: 'test-post-' + moment().unix(),
          status: 0,
        };

        models.Post.create(post, result.user, function(err, newPost) {
          should.not.exist(err);
          should.exist(newPost);
          should.exist(newPost.author);
          done();
        });

      });
    });
  });

  describe('#saveTags()', function() {
    it('should save tags for a new post without error', function(done) {
      newPost(function(err, post) {
        should.not.exist(err);
        should.exist(post);
        post.id.should.not.below(1);

        var tagNames = [moment().format("YYYY-MM-DD"),
          moment().format("YY-MM-DD HH:mm"), moment().format("YYYY-MM-DD HH:mm:ss"),
          moment().format("YY-MM-DD HH:mm:ss")
        ];
        models.Post.saveTags(post, tagNames, function(err, result) {
          should.not.exist(err);
          models.Post.get(post.id, function(err, newPost) {
            should.not.exist(err);
            should.exist(newPost.tags);
            newPost.tags.length.should.equal(4);
            done();
          });
        });
      });
    });
  });

  describe('#getAllPosts()', function() {
    it('should get first page posts with 2 results', function(done) {
      models.Post.getAllPosts(0, 2, function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.items.length.should.equal(2);
        console.log(result);
        done();
      });
    });
  });

  describe('#getTopPosts()', function() {
    it('should get top 2 posts with 2 results', function(done) {
      models.Post.getTopPosts(2, function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.length.should.equal(2);
        console.log(result);
        done();
      });
    });
  });
});