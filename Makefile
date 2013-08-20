all: lint test build

lint:
	./node_modules/.bin/jshint *.js lib test

test:
	./node_modules/.bin/mocha --recursive

components: component.json
	@component install --dev

build: components index.js lib/*.js
	component build --dev

clean:
	rm -rf build

.PHONY: all build lint test
