describe('perf-hunter', function(){
  var assert = require('component/assert');
  var index = require('../../src/perf-hunter');

  describe('()', function(){
    it('should return new cache', function(){
      assert(index.speedIndex);
    })
  });
});
