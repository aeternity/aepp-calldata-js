COMPILER=./bin/aesophia_cli
SOURCEDIR = contracts
SOURCES=$(wildcard $(SOURCEDIR)/*.aes)
BYTECODES=$(SOURCES:.aes=.aeb)
JSON_ACIS=$(SOURCES:.aes=.json)
ADDRESSES=$(SOURCES:.aes=.addr)
BUILDDIR = build

all: $(BUILDDIR)/$(BYTECODES) $(BUILDDIR)/$(JSON_ACIS)

$(BUILDDIR):
	mkdir -p $@

$(BUILDDIR)/$(SOURCEDIR): | $(BUILDDIR)
	mkdir -p $@

$(BUILDDIR)/$(BYTECODES): $(SOURCES) | $(BUILDDIR)/$(SOURCEDIR)
	$(COMPILER) $< -o $@

$(BUILDDIR)/$(JSON_ACIS): $(SOURCES) | $(BUILDDIR)/$(SOURCEDIR)
	$(COMPILER) --create_json_aci $< | jq > $@

watch:
	@echo Watching for file changes in current directory ...
	@while true; do $(MAKE) -q || $(MAKE); sleep 1; done

node_modules: package-lock.json
	npm install && touch $@

tests: node_modules $(BUILDDIR)/$(JSON_ACIS)
	npm test

$(BUILDDIR)/js: | $(BUILDDIR)
	mkdir -p $@

$(BUILDDIR)/js/tests.js: node_modules $(BUILDDIR)/$(JSON_ACIS) $(BUILDDIR)/js
	npm run browser-test-bundle

browser-tests: $(BUILDDIR)/js/tests.js
	@echo Make sure to change the test runner to "tape" in "tests/test.js" prior running this command.
	@echo Open "tests/index.html" in your browser.

integration-tests:
	./tests/integration/encoder.sh
	./tests/integration/decoder.sh

coverage: node_modules $(BUILDDIR)/$(JSON_ACIS)
	npm run coverage

lint: node_modules
	npm run lint

clean:
	rm -f $(BUILDDIR)/$(BYTECODES)
	rm -f $(BUILDDIR)/$(JSON_ACIS)
	rm -f $(BUILDDIR)/$(ADDRESSES)
	rm -rf $(BUILDDIR)/wallet
	rm -rf $(BUILDDIR)/js
	rm -rf $(BUILDDIR)/.nyc_output
	rm -rf node_modules
