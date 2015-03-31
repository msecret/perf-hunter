T= ./node_modules/.bin/duo-test -c make -P 3000

build.js: test/index_test.js
	@duo --stdout $< > build.js

test-browser:
	@$(T) browser

test-phantomjs:
	@$(T) phantomjs

test-saucelabs:
	@$(T) -b safari:5..7 saucelabs

.PHONY: test test-saucelabs test-phantomjs
