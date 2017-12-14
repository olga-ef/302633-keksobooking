'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');

  // удаляет затемнение с карты
  var removeFade = function () {
    map.classList.remove('map--faded');
  };

  var successHandler = function (data) {
    // Активирует страницу при клике по главной метке
    var onMainPinMouseup = function () {
      removeFade();
      window.pin.addMapPins(data);
      window.form.formEnable();
      window.form.inputsDisable(false);
      window.form.synchronizeFields();
      mainPin.removeEventListener('mouseup', onMainPinMouseup);
    };

    // обработчик клика по метке
    var onPinClick = function () {
      window.pin.deactivatePin(event);
      window.pin.activatePin(event);
      window.showCard(event, data);
    };

    mainPin.addEventListener('mouseup', onMainPinMouseup);
    mapPinsContainer.addEventListener('click', onPinClick);
  };

  // Изначальное состояние
  window.form.inputsDisable(true);
  window.backend.load(successHandler, window.backend.errorHandler);

  // Перетаскивание метки
  var getStartCoords = function (evt) {

    return {
      x: evt.pageX,
      y: evt.pageY
    };
  };

  var getMainPinPosition = function (moveEvt, coords) {
    var shift = {
      x: coords.x - moveEvt.pageX,
      y: coords.y - moveEvt.pageY
    };
    var pinHeight = 62;
    var pickHeight = 16;

    var newPosition = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    var pickCoords = {
      x: newPosition.x,
      y: newPosition.y + pinHeight / 2 + pickHeight
    };

    var topEdge = 100 - pinHeight / 2 - pickHeight;
    var bottomEdge = 500 - pinHeight / 2 - pickHeight;

    if (newPosition.y < topEdge) {
      newPosition.y = topEdge;
    } else if (newPosition.y > bottomEdge) {
      newPosition.y = bottomEdge;
    }
    mainPin.style.top = newPosition.y + 'px';
    mainPin.style.left = newPosition.x + 'px';

    var address = document.querySelector('#address');
    address.value = pickCoords.x + ', ' + pickCoords.y;
  };

  var onMainPinMousedown = function (evt) {
    evt.preventDefault();
    var startCoords = getStartCoords(event);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      getMainPinPosition(event, startCoords);
      startCoords = getStartCoords(event);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseUp', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.addEventListener('mousedown', onMainPinMousedown);
})();
