describe('perf-hunter', function(){
  var assert = require('component/assert');
  var hunter = require('../../src/perf-hunter');

  describe('hunt()', function() {
    var fakeWindow;
    beforeEach(function() {
      fakeWindow = {
        performance: {
          timing: {
            start: 12123,
            end: 123123
          }
        }
      }
    });
    it('should return with speedIndex', function() {
      var actual = hunter.hunt();
      assert(actual.speedIndex);
    });
    it('should return object of performanceTiming', function() {
      var actual = hunter.hunt(fakeWindow);
      assert(actual.performanceTiming);
      assert(typeof actual.performanceTiming === 'object');
    })
  });
});
