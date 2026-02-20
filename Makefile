NODE_BIN=./node_modules/.bin
PROJECT=plumper
SRC=$(wildcard lib/*.js)

all: check compile

check: lint test

lint:
	$(NODE_BIN)/biome ci

format:
	$(NODE_BIN)/biome check --fix

test:
	node --test $(TEST_OPTS)

test-cov: TEST_OPTS := --experimental-test-coverage
test-cov: test

benchmark:
	$(NODE_BIN)/matcha --reporter plain benchmark

compile: build/build.js

build/build.js:  $(SRC)
	mkdir -p build
	$(NODE_BIN)/esbuild \
				--bundle \
				--sourcemap \
				--define:DEBUG="true" \
				--global-name=$(PROJECT) \
				--outfile=$@ \
				lib/plumper.js

clean:
	rm -rf build

.PHONY: clean format lint check all compile test benchmark
