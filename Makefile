COMPILER=./bin/aesophia_cli
SOURCEDIR = contracts
SOURCES=$(wildcard $(SOURCEDIR)/*.aes)
BYTECODES=$(SOURCES:.aes=.aeb.json)
JSON_ACIS=$(SOURCES:.aes=.json)
ADDRESSES=$(SOURCES:.aes=.addr)
BUILDDIR = build
INTEGRATION_TESTS=./tests/integration/*.sh
BENCHMARK_TESTS=./tests/benchmark/*.js

all: $(BUILDDIR)/$(BYTECODES) $(BUILDDIR)/$(JSON_ACIS)

$(BUILDDIR):
	mkdir -p $@

$(BUILDDIR)/$(SOURCEDIR): | $(BUILDDIR)
	mkdir -p $@

$(BUILDDIR)/$(BYTECODES): $(SOURCES) | $(BUILDDIR)/$(SOURCEDIR)
	@echo \"$(shell $(COMPILER) $<)\" > $@

# Note on jq default filter: https://github.com/stedolan/jq/issues/1110
$(BUILDDIR)/$(JSON_ACIS): $(SOURCES) | $(BUILDDIR)/$(SOURCEDIR)
	$(COMPILER) --create_json_aci $< | jq . > $@

watch:
	@echo Watching for file changes in current directory ...
	@while true; do $(MAKE) -q || $(MAKE); sleep 1; done

node_modules: package-lock.json
	npm install && touch $@

tests: node_modules $(BUILDDIR)/$(JSON_ACIS) $(BUILDDIR)/$(BYTECODES)
	npm test

$(BUILDDIR)/js/index.html: node_modules $(BUILDDIR)/$(JSON_ACIS) $(BUILDDIR)/$(BYTECODES)
	npm run browser-test-bundle

browser-tests: $(BUILDDIR)/js/index.html
ifneq ($(shell which open),)
	@open build/js/index.html
else
	@echo Open "build/js/index.html" in your browser.
endif

integration-tests: $(INTEGRATION_TESTS) | node_modules $(BUILDDIR)/$(JSON_ACIS)
	@for file in $^; do bash $${file}; done

benchmark-tests: $(BENCHMARK_TESTS) | node_modules $(BUILDDIR)/$(JSON_ACIS)
	@for file in $^; do node $${file}; done

coverage: node_modules $(BUILDDIR)/$(JSON_ACIS) $(BUILDDIR)/$(BYTECODES)
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
