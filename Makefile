MINIFIER=$(shell which yuicompressor || which yuicompressor.sh || which uglifyjs )

all: jquery.autoexpandable.min.js

rebuild: clean all

%.min.js: %.js
	$(MINIFIER) $< > $@

clean:
	-rm -f *.min.js
