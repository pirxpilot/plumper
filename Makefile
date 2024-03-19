NODE_BIN=./node_modules/.bin
PROJECT=plumper
SRC=index.js $(wildcard lib/*.js)

all: check compile

check: lint test

lint: | node_modules
	$(NODE_BIN)/jshint $(SRC) test benchmark

test: | node_modules
	node --require should --test

benchmark: | node_modules
	$(NODE_BIN)/matcha --reporter plain benchmark

compile: build/build.js

build/build.js:  $(SRC) | node_modules
	mkdir -p build
	browserify --require ./index.js:$(PROJECT) --outfile $@

node_modules: package.json
	yarn && touch $@

clean:
	rm -rf build

distclean: clean
	rm -fr node_modules

.PHONY: clean distclean lint check all compile test benchmark
