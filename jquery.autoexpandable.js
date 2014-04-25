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
        // Does nothing so far.
        debug: false
    };


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

            $this.bind('keypress.autoexpandable', function(e){

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

                    var padding = data.paddingBottom;
                    $this
                        .height(0) // to get proper scrollHeight
                        .height(
                            Math.max(
                                settings.minHeight,
                                $this[0].scrollHeight
                                +
                                padding * settings.paddingBottomLines
                            )
                        );

                }, settings.timeout); // setTimeout

            }).trigger('keypress.autoexpandable');

        }); // return each this

    }; // $.fn.autoexpandable

})(jQuery); // context scope end

