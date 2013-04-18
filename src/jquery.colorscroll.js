/*
 * colorScroll - jQuery plugin
 * A jQuery plugin that transitions the background color, when the user scrolls.
 * Version 0.1.0
 *
 * Copyright (c) 2012 Hendrik Lammers
 * http://www.hendriklammers.com
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */

;(function ($, window, undefined) {

  // Create the defaults once
  var pluginName = 'colorScroll',
      document = window.document,
      defaults = {
        
      };

  function Plugin(element, options) {
    this.element = element;

    // extend defaults with options given through the arguments
    this.options = $.extend({}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    
    init: function() {
        
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };

}(jQuery, window));