NODE_BIN=./node_modules/.bin
PROJECT=vis-why

all: check compile

check: lint test

lint: node_modules
	$(NODE_BIN)/jshint index.js lib test

test: node_modules
	$(NODE_BIN)/mocha --require should test


compile: build/build.js

build/build.js: node_modules index.js
	mkdir -p build
	browserify --require ./index.js:$(PROJECT) --outfile $@

node_modules: package.json
	npm install && touch $@

clean:
	rm -rf build

distclean: clean
	rm -fr node_modules

.PHONY: clean distclean lint check all compile test
