'use strict';

(function () {
  var PinOffset = {
    X: 5,
    Y: 40
  };
  var PINS_NUMBER = 5;

  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinsContainer = document.querySelector('.map__pins');
  var cardsDataMap = [];

  // функция генерации метки
  var renderMapPin = function (ad) {
    var pinElement = mapPinTemplate.cloneNode(true);
    pinElement.style.left = (ad.location.x - PinOffset.X) + 'px';
    pinElement.style.top = (ad.location.y - PinOffset.Y) + 'px';
    pinElement.querySelector('img').src = ad.author.avatar;

    return pinElement;
  };

  // фунция отрисовывает метки
  var addMapPins = function (data) {
    var fragment = document.createDocumentFragment();
    var pins;
    window.util.cleanArray(cardsDataMap);
    for (var i = 0; i < data.length && i < PINS_NUMBER; i++) {
      fragment.appendChild(renderMapPin(data[i]));
      pins = fragment.querySelectorAll('.map__pin');
      cardsDataMap.push({
        'elem': pins[i],
        'obj': data[i]
      });
    }
    mapPinsContainer.appendChild(fragment);
  };

  // активирует метку
  var activatePin = function (clickedPin) {
    clickedPin.classList.add('map__pin--active');
  };

  // убирает подсветку метки
  var deactivatePin = function () {
    var pinsList = mapPinsContainer.querySelectorAll('.map__pin');

    for (var i = 0; i < pinsList.length; i++) {
      pinsList[i].classList.remove('map__pin--active');
    }
  };

  window.pin = {
    cardsDataMap: cardsDataMap,
    addMapPins: addMapPins,
    activatePin: activatePin,
    deactivatePin: deactivatePin
  };
})();
