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

clean:
	rm $(BUILDDIR)/$(BYTECODES) $(BUILDDIR)/$(JSON_ACIS)
