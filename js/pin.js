'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinsContainer = document.querySelector('.map__pins');
  window.pin = {

    // отрисовывает метки на карте
    renderMapPin: function (object) {
      var pinElement = mapPinTemplate.cloneNode(true);

      pinElement.style.left = object.location.x + 'px';
      pinElement.style.top = object.location.y + 'px';
      pinElement.querySelector('img').src = object.author.avatar;

      return pinElement;
    },

    // активирует метку
    activatePin: function (evt) {
      var target = evt.target;
      var btn = target.closest('button');
      if (!btn) {
        return;
      }
      if (!mapPinsContainer.contains(btn)) {
        return;
      }
      btn.classList.add('map__pin--active');
    },

    // убирает подсветку метки
    deactivatePin: function (evt) {
      var pinsList = mapPinsContainer.querySelectorAll('.map__pin');
      var mainPin = document.querySelector('.map__pin--main');
      var target = evt.target;
      var btn = target.closest('button');
      if (!btn) {
        return;
      }
      for (var i = 0; i < pinsList.length; i++) {
        mainPin.classList.remove('map__pin--active');
        pinsList[i].classList.remove('map__pin--active');
      }
    }
  };
})();
