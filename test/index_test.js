describe('index', function(){
  var assert = require('component/assert');
  var index = require('../index');

  describe('()', function(){
    it('should return new cache', function(){
      assert(index.speedIndex);
    })
  });
});
