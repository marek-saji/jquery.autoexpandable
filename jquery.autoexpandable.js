// = autoexpandable textarea, jQuery plugin =
//
// * author: Marek 'saji' Augustynowicz
// * license: MIT (LICENSE.md file should be distributed with the code)
// * http://github.com/marek-saji/jquery.autoexpandable
//
// == USAGE ==
// {{{
// <script type="text/javascript" src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
// <script type="text/javascript" src="jquery.autoexpandable.js"></script>
// <script type="text/javascript">
//    $(function(){
//        $('textarea.foo').autoexpandable();
//
//        // you may also specify settings here
//        $('textarea.bar').autoexpandable({
//            timeout: 100
//        });
//    });
// </script>
//
// You can also specify settings with data-autoexpandable attribute:
//
// <textarea data-autoexpandable='{"debug": true}'>
//     Lorem ipsum dolor sit amet neque. Nunc a diam. Suspendisse diam...
// </textarea>
//
// }}}


(function($){ // context scope begin

    // == {{{default_settings}}} ==
    var default_settings = {
        // Timeout after which height is measured and applied to textarea.
        timeout: 200,
        // Height below which textarea will not shrink.
        minHeight: undefined,
        // Number of lines to pad after entered text.
        paddingBottomLines: 2,
        // Duration of transition between textareas' heights
        transitionDuration: '0.1s',
        // Does nothing so far.
        debug: false
    };

    var TRANSITION_PREFIXES = ['', '-webkit-', '-moz-'];
    var transitionDurationProperty;

    function getTransitionDurationProperty ($element)
    {
        var idx;
        if (undefined === transitionDurationProperty)
        {
            for (idx in TRANSITION_PREFIXES)
            {
                transitionDurationProperty = TRANSITION_PREFIXES[idx] + 'transition-duration';
                if (undefined !== $element.css(transitionDurationProperty))
                {
                    break;
                }
            }
        }
        return transitionDurationProperty;
    }

    // == {{{autoexpandable}}} ==
    // function called with {{{$(selector).autoexpandable()}}},
    // {{{this}}} is a set of matched elements
    $.fn.autoexpandable = function(user_settings){

        var invoke_settings = {};

        // merge default and user settings
        $.extend(invoke_settings, default_settings, user_settings);

        return this.each(function(){

            var $this = $(this),
                data = $this.data('autoexpandable'),
                settings = {};

            data || $this.data('autoexpandable', {});

            // merge-in settings specified in `data-autoexpandable` attribute
            $.extend(settings, invoke_settings, data);

            $this.bind('keypress.autoexpandable keyup.autoexpandable', function(e){

                var $this = $(this),
                    data = $this.data('autoexpandable');

                if (data.timeoutID)
                    return;

                // ==== setTimeout ===
                // Modyfying textarea height after `settings.timeout`.
                data.timeoutID = window.setTimeout(function(){

                    data.timeoutID = null;

                    if (settings.minHeight === undefined)
                    {
                        settings.minHeight = $this.height();
                    }

                    if (!settings.paddingBottom)
                    {
                        // ==== determinig 1em ====
                        // To determine how much px 1em has, we create
                        // dummy element with some of css attributes cloned.
                        var $foo = $('<div />', {
                            'text' : 'Mj',
                            'css' : {
                                'white-space' : 'pre',
                                'font-family' : $this.css('font-family'),
                                'font-size'   : $this.css('font-size'),
                                'line-height' : $this.css('line-height')
                            }
                        });
                        $foo.insertAfter($this);
                        data.paddingBottom = $foo.outerHeight();
                        $foo.remove();
                    }

                    var padding = data.paddingBottom,
                        transitionDurationProperty = getTransitionDurationProperty($this),
                        transitionDuration = $this.css(transitionDurationProperty),
                        oldHeight,
                        height;

                    if ('0s' !== transitionDuration)
                    {
                        // disable transitions so that setting height(0)
                        // allows to read scrollHeight immediatelly
                        $this.css(transitionDurationProperty, '0s');
                    }

                    oldHeight = $this.height();
                    $this.height(0); // to get proper scrollHeight
                    height = $this[0].scrollHeight;
                    height += padding * settings.paddingBottomLines;
                    $this.height( oldHeight );
                    $this[0].scrollHeight; // recalculate layout

                    $this.css(transitionDurationProperty, settings.transitionDuration);
                    $this.height(Math.max(settings.minHeight, height));
                    $this.css(transitionDurationProperty, transitionDuration);

                }, settings.timeout); // setTimeout

            }).trigger('keypress.autoexpandable');

        }); // return each this

    }; // $.fn.autoexpandable

})(jQuery); // context scope end

