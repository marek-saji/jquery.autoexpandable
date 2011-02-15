YUICOMPRESSOR=yuicompressor.sh
LESSC=lessc.sh

all: jquery.autoexpandable.min.js

rebuild: clean all

%.css: %.less
	$(LESSC) $< > $@

%.min.css: %.css
	$(YUICOMPRESSOR) $< > $@

%.min.js: %.js
	$(YUICOMPRESSOR) $< > $@

clean:
	-rm -f *.{min.js,css}

