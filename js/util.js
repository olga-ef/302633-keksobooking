 'use strict';

 (function () {

 	var lastTimeout;

 	window.debounce = function (fn, interval) {
 		if (lastTimeout) {
      window.clearTimeout(lastTimeout)
    }
    lastTimeout = window.setTimeout(fn, interval)    
  };
 })();
