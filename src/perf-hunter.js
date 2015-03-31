var SpeedIndex = require('msecret/RUM-SpeedIndex');

var hunter = {
  hunt: function(passedWindow) {
    var results = {};

    results.speedIndex = SpeedIndex();
    results.performanceTiming = this.performanceTimings(passedWindow || window);

    return results;
  },
  performanceTimings: function(window) {
    if (window.performance && window.performance.timing) {
      return window.performance.timing;
    }
  }
};

module.exports = hunter;
