(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep || req);
    }, m, m.exports, outer, modules, cache, entries);

    // store to cache after successful resolve
    cache[id] = m;

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
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

}, {"component/assert":2,"../../src/perf-hunter":3}],
2: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var equals = require('equals');
var fmt = require('fmt');
var stack = require('stack');

/**
 * Assert `expr` with optional failure `msg`.
 *
 * @param {Mixed} expr
 * @param {String} [msg]
 * @api public
 */

module.exports = exports = function (expr, msg) {
  if (expr) return;
  throw error(msg || message());
};

/**
 * Assert `actual` is weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.equal = function (actual, expected, msg) {
  if (actual == expected) return;
  throw error(msg || fmt('Expected %o to equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notEqual = function (actual, expected, msg) {
  if (actual != expected) return;
  throw error(msg || fmt('Expected %o not to equal %o.', actual, expected));
};

/**
 * Assert `actual` is deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.deepEqual = function (actual, expected, msg) {
  if (equals(actual, expected)) return;
  throw error(msg || fmt('Expected %o to deeply equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notDeepEqual = function (actual, expected, msg) {
  if (!equals(actual, expected)) return;
  throw error(msg || fmt('Expected %o not to deeply equal %o.', actual, expected));
};

/**
 * Assert `actual` is strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.strictEqual = function (actual, expected, msg) {
  if (actual === expected) return;
  throw error(msg || fmt('Expected %o to strictly equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notStrictEqual = function (actual, expected, msg) {
  if (actual !== expected) return;
  throw error(msg || fmt('Expected %o not to strictly equal %o.', actual, expected));
};

/**
 * Assert `block` throws an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.throws = function (block, err, msg) {
  var threw;
  try {
    block();
  } catch (e) {
    threw = e;
  }

  if (!threw) throw error(msg || fmt('Expected %s to throw an error.', block.toString()));
  if (err && !(threw instanceof err)) {
    throw error(msg || fmt('Expected %s to throw an %o.', block.toString(), err));
  }
};

/**
 * Assert `block` doesn't throw an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.doesNotThrow = function (block, err, msg) {
  var threw;
  try {
    block();
  } catch (e) {
    threw = e;
  }

  if (threw) throw error(msg || fmt('Expected %s not to throw an error.', block.toString()));
  if (err && (threw instanceof err)) {
    throw error(msg || fmt('Expected %s not to throw an %o.', block.toString(), err));
  }
};

/**
 * Create a message from the call stack.
 *
 * @return {String}
 * @api private
 */

function message() {
  if (!Error.captureStackTrace) return 'assertion failed';
  var callsite = stack()[2];
  var fn = callsite.getFunctionName();
  var file = callsite.getFileName();
  var line = callsite.getLineNumber() - 1;
  var col = callsite.getColumnNumber() - 1;
  var src = get(file);
  line = src.split('\n')[line].slice(col);
  var m = line.match(/assert\((.*)\)/);
  return m && m[1].trim();
}

/**
 * Load contents of `script`.
 *
 * @param {String} script
 * @return {String}
 * @api private
 */

function get(script) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', script, false);
  xhr.send(null);
  return xhr.responseText;
}

/**
 * Error with `msg`, `actual` and `expected`.
 *
 * @param {String} msg
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @return {Error}
 */

function error(msg, actual, expected){
  var err = new Error(msg);
  err.showDiff = 3 == arguments.length;
  err.actual = actual;
  err.expected = expected;
  return err;
}

}, {"equals":4,"fmt":5,"stack":6}],
4: [function(require, module, exports) {
var type = require('type')

// (any, any, [array]) -> boolean
function equal(a, b, memos){
  // All identical values are equivalent
  if (a === b) return true
  var fnA = types[type(a)]
  var fnB = types[type(b)]
  return fnA && fnA === fnB
    ? fnA(a, b, memos)
    : false
}

var types = {}

// (Number) -> boolean
types.number = function(a, b){
  return a !== a && b !== b/*Nan check*/
}

// (function, function, array) -> boolean
types['function'] = function(a, b, memos){
  return a.toString() === b.toString()
    // Functions can act as objects
    && types.object(a, b, memos)
    && equal(a.prototype, b.prototype)
}

// (date, date) -> boolean
types.date = function(a, b){
  return +a === +b
}

// (regexp, regexp) -> boolean
types.regexp = function(a, b){
  return a.toString() === b.toString()
}

// (DOMElement, DOMElement) -> boolean
types.element = function(a, b){
  return a.outerHTML === b.outerHTML
}

// (textnode, textnode) -> boolean
types.textnode = function(a, b){
  return a.textContent === b.textContent
}

// decorate `fn` to prevent it re-checking objects
// (function) -> function
function memoGaurd(fn){
  return function(a, b, memos){
    if (!memos) return fn(a, b, [])
    var i = memos.length, memo
    while (memo = memos[--i]) {
      if (memo[0] === a && memo[1] === b) return true
    }
    return fn(a, b, memos)
  }
}

types['arguments'] =
types.array = memoGaurd(arrayEqual)

// (array, array, array) -> boolean
function arrayEqual(a, b, memos){
  var i = a.length
  if (i !== b.length) return false
  memos.push([a, b])
  while (i--) {
    if (!equal(a[i], b[i], memos)) return false
  }
  return true
}

types.object = memoGaurd(objectEqual)

// (object, object, array) -> boolean
function objectEqual(a, b, memos) {
  if (typeof a.equal == 'function') {
    memos.push([a, b])
    return a.equal(b, memos)
  }
  var ka = getEnumerableProperties(a)
  var kb = getEnumerableProperties(b)
  var i = ka.length

  // same number of properties
  if (i !== kb.length) return false

  // although not necessarily the same order
  ka.sort()
  kb.sort()

  // cheap key test
  while (i--) if (ka[i] !== kb[i]) return false

  // remember
  memos.push([a, b])

  // iterate again this time doing a thorough check
  i = ka.length
  while (i--) {
    var key = ka[i]
    if (!equal(a[key], b[key], memos)) return false
  }

  return true
}

// (object) -> array
function getEnumerableProperties (object) {
  var result = []
  for (var k in object) if (k !== 'constructor') {
    result.push(k)
  }
  return result
}

module.exports = equal

}, {"type":7}],
7: [function(require, module, exports) {

var toString = {}.toString
var DomNode = typeof window != 'undefined'
  ? window.Node
  : Function

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = exports = function(x){
  var type = typeof x
  if (type != 'object') return type
  type = types[toString.call(x)]
  if (type) return type
  if (x instanceof DomNode) switch (x.nodeType) {
    case 1:  return 'element'
    case 3:  return 'text-node'
    case 9:  return 'document'
    case 11: return 'document-fragment'
    default: return 'dom-node'
  }
}

var types = exports.types = {
  '[object Function]': 'function',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Object]': 'object',
  '[object Text]': 'text-node',
  '[object Uint8Array]': 'bit-array',
  '[object Uint16Array]': 'bit-array',
  '[object Uint32Array]': 'bit-array',
  '[object Uint8ClampedArray]': 'bit-array',
  '[object Error]': 'error',
  '[object FormData]': 'form-data',
  '[object File]': 'file',
  '[object Blob]': 'blob'
}

}, {}],
5: [function(require, module, exports) {

/**
 * Export `fmt`
 */

module.exports = fmt;

/**
 * Formatters
 */

fmt.o = JSON.stringify;
fmt.s = String;
fmt.d = parseInt;

/**
 * Format the given `str`.
 *
 * @param {String} str
 * @param {...} args
 * @return {String}
 * @api public
 */

function fmt(str){
  var args = [].slice.call(arguments, 1);
  var j = 0;

  return str.replace(/%([a-z])/gi, function(_, f){
    return fmt[f]
      ? fmt[f](args[j++])
      : _ + f;
  });
}

}, {}],
6: [function(require, module, exports) {

/**
 * Expose `stack()`.
 */

module.exports = stack;

/**
 * Return the stack.
 *
 * @return {Array}
 * @api public
 */

function stack() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack){ return stack; };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}
}, {}],
3: [function(require, module, exports) {
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

}, {"msecret/RUM-SpeedIndex":8}],
8: [function(require, module, exports) {
/******************************************************************************
Copyright (c) 2014, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    * Neither the name of the <ORGANIZATION> nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
******************************************************************************/

/******************************************************************************
*******************************************************************************
  Calculates the Speed Index for a page by:
  - Collecting a list of visible rectangles for elements that loaded
    external resources (images, background images, fonts)
  - Gets the time when the external resource for those elements loaded
    through Resource Timing
  - Calculates the likely time that the background painted
  - Runs the various paint rectangles through the SpeedIndex calculation:
    https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index

  TODO:
  - Improve the start render estimate
  - Handle overlapping rects (though maybe counting the area as multiple paints
    will work out well)
  - Detect elements with Custom fonts and the time that the respective font
    loaded
  - Better error handling for browsers that don't support resource timing
*******************************************************************************
******************************************************************************/

var RUMSpeedIndex = function(win) {
  win = win || window;
  var doc = win.document;

  /****************************************************************************
    Support Routines
  ****************************************************************************/
  // Get the rect for the visible portion of the provided DOM element
  var GetElementViewportRect = function(el) {
    var intersect = false;
    if (el.getBoundingClientRect) {
      var elRect = el.getBoundingClientRect();
      intersect = {'top': Math.max(elRect.top, 0),
                       'left': Math.max(elRect.left, 0),
                       'bottom': Math.min(elRect.bottom, (win.innerHeight || doc.documentElement.clientHeight)),
                       'right': Math.min(elRect.right, (win.innerWidth || doc.documentElement.clientWidth))};
      if (intersect.bottom <= intersect.top ||
          intersect.right <= intersect.left) {
        intersect = false;
      } else {
        intersect.area = (intersect.bottom - intersect.top) * (intersect.right - intersect.left);
      }
    }
    return intersect;
  };

  // Check a given element to see if it is visible
  var CheckElement = function(el, url) {
    if (url) {
      var rect = GetElementViewportRect(el);
      if (rect) {
        rects.push({'url': url,
                     'area': rect.area,
                     'rect': rect});
      }
    }
  };

  // Get the visible rectangles for elements that we care about
  var GetRects = function() {
    // Walk all of the elements in the DOM (try to only do this once)
    var elements = doc.getElementsByTagName('*');
    var re = /url\((http.*)\)/ig;
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var style = win.getComputedStyle(el);

      // check for Images
      if (el.tagName == 'IMG') {
        CheckElement(el, el.src);
      }
      // Check for background images
      if (style['background-image']) {
        re.lastIndex = 0;
        var matches = re.exec(style['background-image']);
        if (matches && matches.length > 1)
          CheckElement(el, matches[1]);
      }
      // recursively walk any iFrames
      if (el.tagName == 'IFRAME') {
        try {
          var rect = GetElementViewportRect(el);
          if (rect) {
            var tm = RUMSpeedIndex(el.contentWindow);
            if (tm) {
              rects.push({'tm': tm,
                          'area': rect.area,
                          'rect': rect});
            }
        }
        } catch(e) {
        }
      }
    }
  };

  // Get the time at which each external resource loaded
  var GetRectTimings = function() {
    var timings = {};
    var requests = win.performance.getEntriesByType("resource");
    for (var i = 0; i < requests.length; i++)
      timings[requests[i].name] = requests[i].responseEnd;
    for (var j = 0; j < rects.length; j++) {
      if (!('tm' in rects[j]))
        rects[j].tm = timings[rects[j].url] !== undefined ? timings[rects[j].url] : 0;
    }
  };

  // Get the first paint time.
  var GetFirstPaint = function() {
    // If the browser supports a first paint event, just use what the browser reports
    if ('msFirstPaint' in win.performance.timing)
      firstPaint = win.performance.timing.msFirstPaint - navStart;
    if ('chrome' in win && 'loadTimes' in win.chrome) {
      var chromeTimes = win.chrome.loadTimes();
      if ('firstPaintTime' in chromeTimes && chromeTimes.firstPaintTime > 0) {
        var startTime = chromeTimes.startLoadTime;
        if ('requestTime' in chromeTimes)
          startTime = chromeTimes.requestTime;
        if (chromeTimes.firstPaintTime >= startTime)
          firstPaint = (chromeTimes.firstPaintTime - startTime) * 1000.0;
      }
    }
    // For browsers that don't support first-paint or where we get insane values,
    // use the time of the last non-async script or css from the head.
    if (firstPaint === undefined || firstPaint < 0 || firstPaint > 120000) {
      firstPaint = win.performance.timing.responseStart - navStart;
      var headURLs = {};
      var headElements = doc.getElementsByTagName('head')[0].children;
      for (var i = 0; i < headElements.length; i++) {
        var el = headElements[i];
        if (el.tagName == 'SCRIPT' && el.src && !el.async)
          headURLs[el.src] = true;
        if (el.tagName == 'LINK' && el.rel == 'stylesheet' && el.href)
          headURLs[el.href] = true;
      }
      var requests = win.performance.getEntriesByType("resource");
      var doneCritical = false;
      for (var j = 0; j < requests.length; j++) {
        if (!doneCritical &&
            headURLs[requests[j].name] &&
           (requests[j].initiatorType == 'script' || requests[j].initiatorType == 'link')) {
          var requestEnd = requests[j].responseEnd;
          if (firstPaint === undefined || requestEnd > firstPaint)
            firstPaint = requestEnd;
        } else {
          doneCritical = true;
        }
      }
    }
    firstPaint = Math.max(firstPaint, 0);
  };

  // Sort and group all of the paint rects by time and use them to
  // calculate the visual progress
  var CalculateVisualProgress = function() {
    var paints = {'0':0};
    var total = 0;
    for (var i = 0; i < rects.length; i++) {
      var tm = firstPaint;
      if ('tm' in rects[i] && rects[i].tm > firstPaint)
        tm = rects[i].tm;
      if (paints[tm] === undefined)
        paints[tm] = 0;
      paints[tm] += rects[i].area;
      total += rects[i].area;
    }
    // Add a paint area for the page background (count 10% of the pixels not
    // covered by existing paint rects.
    var pixels = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0) *
                 Math.max(doc.documentElement.clientHeight, win.innerHeight || 0);
    if (pixels > 0 ) {
      pixels = Math.max(pixels - total, 0) * pageBackgroundWeight;
      if (paints[firstPaint] === undefined)
        paints[firstPaint] = 0;
      paints[firstPaint] += pixels;
      total += pixels;
    }
    // Calculate the visual progress
    if (total) {
      for (var time in paints) {
        if (paints.hasOwnProperty(time)) {
          progress.push({'tm': time, 'area': paints[time]});
        }
      }
      progress.sort(function(a,b){return a.tm - b.tm;});
      var accumulated = 0;
      for (var j = 0; j < progress.length; j++) {
        accumulated += progress[j].area;
        progress[j].progress = accumulated / total;
      }
    }
  };

  // Given the visual progress information, Calculate the speed index.
  var CalculateSpeedIndex = function() {
    if (progress.length) {
      SpeedIndex = 0;
      var lastTime = 0;
      var lastProgress = 0;
      for (var i = 0; i < progress.length; i++) {
        var elapsed = progress[i].tm - lastTime;
        if (elapsed > 0 && lastProgress < 1)
          SpeedIndex += (1 - lastProgress) * elapsed;
        lastTime = progress[i].tm;
        lastProgress = progress[i].progress;
      }
    } else {
      SpeedIndex = firstPaint;
    }
  };

  /****************************************************************************
    Main flow
  ****************************************************************************/
  var rects = [];
  var progress = [];
  var firstPaint;
  var SpeedIndex;
  var pageBackgroundWeight = 0.1;
  try {
    var navStart = win.performance.timing.navigationStart;
    GetRects();
    GetRectTimings();
    GetFirstPaint();
    CalculateVisualProgress();
    CalculateSpeedIndex();
  } catch(e) {
  }
  /* Debug output for testing
  var dbg = '';
  dbg += "Paint Rects\n";
  for (var i = 0; i < rects.length; i++)
    dbg += '(' + rects[i].area + ') ' + rects[i].tm + ' - ' + rects[i].url + "\n";
  dbg += "Visual Progress\n";
  for (var i = 0; i < progress.length; i++)
    dbg += '(' + progress[i].area + ') ' + progress[i].tm + ' - ' + progress[i].progress + "\n";
  dbg += 'First Paint: ' + firstPaint + "\n";
  dbg += 'Speed Index: ' + SpeedIndex + "\n";
  console.log(dbg);
  */
  return SpeedIndex;
};


module.exports = RUMSpeedIndex;

}, {}]}, {}, {"1":""})