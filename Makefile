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

coverage: node_modules $(BUILDDIR)/$(JSON_ACIS)
	npm run coverage

clean:
	rm $(BUILDDIR)/$(BYTECODES)
	rm $(BUILDDIR)/$(JSON_ACIS)
	rm -rf node_modules
	rm -rf .nyc_output
