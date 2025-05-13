NODE_BIN=./node_modules/.bin
PROJECT=plumper
SRC=index.js $(wildcard lib/*.js)

all: check compile

check: lint test

lint: | node_modules
	$(NODE_BIN)/biome ci

format: | node_modules
	$(NODE_BIN)/biome check --fix

test: | node_modules
	node --test

benchmark: | node_modules
	$(NODE_BIN)/matcha --reporter plain benchmark

compile: build/build.js

build/build.js:  $(SRC) | node_modules
	mkdir -p build
	$(NODE_BIN)/esbuild \
				--bundle \
				--sourcemap \
				--define:DEBUG="true" \
				--global-name=$(PROJECT) \
				--outfile=$@ \
				index.js

node_modules: package.json
	yarn
	touch $@

clean:
	rm -rf build

distclean: clean
	rm -fr node_modules

.PHONY: clean distclean format lint check all compile test benchmark
