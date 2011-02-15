autoexpandable textarea, jQuery plugin
=====================================

Grows, when user enters more content.

Usage
-----

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="jquery.autoexpandable.js"></script>
    <script type="text/javascript">
       $(function(){
           $('textarea').autoexpandable();

           // you may also specify settings here
           $('textarea.text').autoexpandable({
               timeout: 100
           });
       });
    </script>

You can also specify settings with `data-encapsulating` attribute:

    <textarea data-autoexpandable='{"paddingBottomLines": 3}'>
        Lorem ipsum...
    </textarea>

Settings
--------


### timeout
default value: 200

Timeout after which height is measured and applied to textarea.

### minHeight
default value: null

Height below which textarea will not shrink. If absent, on-load textarea height is used.

Note that height is also limited by `[min-height]`.

### paddingBottomLines
default value: 2

Number of lines to pad after entered text.

### debug
default value: false

Does nothing so far.


[min-height]: http://www.w3.org/TR/CSS21/visudet.html#min-max-heights
