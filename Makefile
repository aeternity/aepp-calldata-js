COMPILER=./bin/aesophia_cli
SOURCEDIR = contracts
SOURCES=$(wildcard $(SOURCEDIR)/*.aes)
BYTECODES=$(SOURCES:.aes=.aeb)
JSON_ACIS=$(SOURCES:.aes=.json)
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
	@echo Make sure to change the test runner to "tape" in "src/test.js" prior running this command.
	@echo Open "tests/index.html" in your browser.

coverage: node_modules $(BUILDDIR)/$(JSON_ACIS)
	npm run coverage

clean:
	rm $(BUILDDIR)/$(BYTECODES)
	rm $(BUILDDIR)/$(JSON_ACIS)
	rm -rf $(BUILDDIR)/js
	rm -rf node_modules
	rm -rf .nyc_output
