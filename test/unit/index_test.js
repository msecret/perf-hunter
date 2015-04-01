describe('perf-hunter', function(){
  var assert = require('component/assert');
  var sinon = require('ianstormtaylor/sinon');
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
    });
  });

  describe('send()', function() {
    it('should call passed in function with data as param', function() {
      var spy = sinon.spy(),
          expected = {test: 'data'};
      hunter.send(expected, spy);

      assert(spy.calledOnce);
    });
  });
});
