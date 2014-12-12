/*
 * colorScroll - jQuery plugin
 * A jQuery plugin that transitions the background color, when the user scrolls.
 * Version 0.3.0
 *
 * https://github.com/hendriklammers/jquery-colorscroll
 *
 * Copyright (c) 2013 Hendrik Lammers
 * http://www.hendriklammers.com
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */

// TODO: Make available to AMD and commonjs. Done but should be tested
// TODO: Add option to the scrolling on an element other than the standard $(document)
// TODO: Add option to use on any CSS property that accept a color value
// TODO: Add callback function
// TODO: Create unit tests
// TODO: Create decent sample page
// TODO: Proper versioning

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    // Create the defaults once
    var pluginName = 'colorScroll',
        document = window.document,
        $document = $(document),
        $window = $(window),
        events = {
            UPDATE: 'update.colorScroll'
        },
        defaults = {
            // Default colors are black & white
            colors: [{
                color: '#FFFFFF',
                position: '0%'
            }, {
                color: '#000000',
                position: '100%'
            }],
            // The element to use for scroll events
            scrollElement: $document,
            // Use standard browser scrolling (false) or use mouseWheel plugin (true)
            fauxScroll: false,
            colorChange: undefined
        },

        // rgba support check
        rgbaSupport = (function() {
            var elem = document.createElement('div');
            var style = elem.style;
            style.cssText = 'background-color:rgba(150,255,150,.5)';

            return ('' + style.backgroundColor).indexOf('rgba') > -1;
        }()),

        // Sort by property
        dynamicSort = function (property) {
            return function (a, b) {
                return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            };
        },

        // Calculate an in-between color. Returns "rgba(250,250,250,1)"-like string.
        calculateColor = function(begin, end, pos) {
            var color = 'rgb' + (rgbaSupport ? 'a' : '') + '(' + parseInt((begin[0] + pos * (end[0] - begin[0])), 10) + ',' + parseInt((begin[1] + pos * (end[1] - begin[1])), 10) + ',' + parseInt((begin[2] + pos * (end[2] - begin[2])), 10);

            if (rgbaSupport) {
                color += ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);
            }

            color += ')';

            return color;
        },

        // Parse a CSS-syntax color. Outputs an array [r, g, b, a]
        parseColor = function(color) {
            var match, parsed;

            if ((match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color))) {
                // Match #aabbcc
                parsed = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];
            } else if ((match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color))) {
                // Match #abc
                parsed = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];
            } else if ((match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))) {
                // Match rgb(n, n, n)
                parsed = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), 1];
            } else if ((match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color))) {
                // Match rgba(n, n, n, n)
                parsed = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), parseFloat(match[4])];
            }

            return parsed;
        };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);

        // extend defaults with options given through the arguments
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        colors: [],

        init: function () {
            // Initialize the positions of the colors
            this.setPositions();

            // Set current color
            this.currentColor = this.$element.css('background-color');

            // Init color to match the current scroll position for the first time
            this.updateColor();

            this.addListeners();
        },

        addListeners: function() {
            var self = this;

            // Listen for scroll event on document
            this.options.scrollElement.on('scroll', $.proxy(this.updateColor, this));

            // this.maxScrollAmount changes on browser resize
            // Use smartresize plugin: https://github.com/louisremi/jquery-smartresize
            $window.on('debouncedresize', function() {
                // Update new positions
                self.setPositions();
                self.updateColor();
            });
        },

        setPositions: function() {
            // The maximum value that can be scrolled
            var maxScrollAmount = $document.height() - $window.height(),
                colors = [];

            // Go through all colors
            for (var i = 0; i < this.options.colors.length; i++) {
                var obj = {},
                    pos = this.options.colors[i].position;

                obj.color = this.options.colors[i].color;

                if (typeof pos === 'string') {
                    if (pos.charAt(pos.length - 1) === '%') {
                        // If it's a percentage convert to absolute value
                        obj.position = Math.floor((parseFloat(pos) * maxScrollAmount) / 100);
                    } else {
                        obj.position = parseFloat(pos);
                    }
                } else {
                    obj.position = pos;
                }

                colors.push(obj);
            }

            // Sort array by position values
            colors.sort(dynamicSort('position'));

            this.colors = colors;
        },

        updateColor: function() {
            var scrollAmount = $document.scrollTop(),
                pos1,
                pos2,
                color1,
                color2;

            if (scrollAmount <= this.colors[0].position) {
                // Use the first color the the colors array
                this.setColor(this.colors[0].color);
            } else if (scrollAmount >= this.colors[this.colors.length - 1].position) {
                // Use the last color the the colors array
                this.setColor(this.colors[this.colors.length - 1].color);
            } else {
                // Get the position
                for (var i = 0; i < this.colors.length; i++) {
                    // Find out between which 2 colors we currently are
                    if (scrollAmount >= this.colors[i].position) {
                        pos1 = this.colors[i].position;
                        color1 = this.colors[i].color;
                    } else {
                        pos2 = this.colors[i].position;
                        color2 = this.colors[i].color;
                        break;
                    }
                }
                // Calculate the relative amount scrolled
                var relativePos = ((scrollAmount - pos1) / (pos2 - pos1));

                // Calculate new color value and set it using setColor
                var color = calculateColor(parseColor(color1), parseColor(color2), relativePos);
                this.setColor(color);
            }
        },

        setColor: function (newColor) {
            if (newColor !== this.currentColor) {
                this.$element.css('background-color', newColor);
                this.currentColor = newColor;

                // Trigger event with the color value
                this.$element.trigger(events.UPDATE, {color: newColor});

                // Trigger callback function
                if (this.options.colorChange) {
                    this.options.colorChange(newColor);
                }
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
}));

/*
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
(function($) {
    'use strict';

var $event = $.event,
    $special,
    resizeTimeout;

$special = $event.special.debouncedresize = {
    setup: function() {
        $( this ).on( "resize", $special.handler );
    },
    teardown: function() {
        $( this ).off( "resize", $special.handler );
    },
    handler: function( event, execAsap ) {
        // Save the context
        var context = this,
            args = arguments,
            dispatch = function() {
                // set correct event type
                event.type = "debouncedresize";
                $event.dispatch.apply( context, args );
            };

        if ( resizeTimeout ) {
            clearTimeout( resizeTimeout );
        }

        if (execAsap) {
            dispatch();
        } else {
            resizeTimeout = setTimeout( dispatch, $special.threshold );
        }
    },
    threshold: 150
};

})(jQuery);
