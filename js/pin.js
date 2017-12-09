'use strict';

(function () {
  // метки на карте
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  window.renderMapPin = function (object) {
    var pinElement = mapPinTemplate.cloneNode(true);

    pinElement.style.left = object.location.x + 'px';
    pinElement.style.top = object.location.y + 'px';
    pinElement.querySelector('img').src = object.author.avatar;

    return pinElement;
  };
})();
