'use strict';

(function () {
  window.synchronizeFields = function (elem1, elem2, array1, array2, callback) {
    var index = array1.indexOf(elem1.value);
    var value = array2[index];
    callback(elem2, value);
  };
})();
