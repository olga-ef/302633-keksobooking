'use strict';

(function () {

  var lastTimeout;

  // выполняет заданную функцию, через заданный интервал времени
  var debounce = function (fn, interval) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fn, interval);
  };

  // очищает массив
  var cleanArray = function (array) {
    array.splice(0, array.length);
  };

  // случайный индекс
  var getRandomIndex = function (array) {
    return Math.floor(Math.random() * array.length);
  };

  // перемешивает занчения в массиве случайным образом
  var getRandomArray = function (array) {
    var arrayCopy = array;
    for (var i = arrayCopy.length - 1; i > 0; i--) {
      var randomIndex = getRandomIndex(arrayCopy);
      var randomElement = arrayCopy[randomIndex];
      arrayCopy[randomIndex] = arrayCopy[i];
      arrayCopy[i] = randomElement;
    }
    return arrayCopy;
  };

  window.util = {
    debounce: debounce,
    cleanArray: cleanArray,
    getRandomArray: getRandomArray
  };
})();
