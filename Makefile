MINIFIER=$(shell which uglifyjs || which yuicompressor || which yuicompressor.sh )

all: jquery.autoexpandable.min.js

rebuild: clean all

%.min.js: %.js
	$(MINIFIER) $< > $@

clean:
	-rm -f *.min.js
