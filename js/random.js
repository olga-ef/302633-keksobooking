'use strict';

(function () {
  window.random = {
    // случайный индекс
    getRandomIndex: function (array) {
      return Math.floor(Math.random() * array.length);
    },

    // случайное целое число в диапазоне

    getRandomInRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // случайный неповторяющийся элемент массива

    getRandomElement: function (array) {
      var arrayCopy = array;
      var randomIndex = window.random.getRandomIndex(arrayCopy);
      var randomElement = arrayCopy[randomIndex];
      arrayCopy.splice(randomIndex, 1);

      return randomElement;
    },

    // массив случайной длины

    getRandomArray: function (array) {
      var arrayCopy = array;
      for (var i = arrayCopy.length - 1; i > 0; i--) {
        var randomIndex = window.random.getRandomIndex(arrayCopy);
        var randomElement = arrayCopy[randomIndex];
        arrayCopy[randomIndex] = arrayCopy[i];
        arrayCopy[i] = randomElement;
      }
      return arrayCopy.slice(window.random.getRandomIndex(arrayCopy));
    }
  };
})();
