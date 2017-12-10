'use strict';
(function () {
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mainPin = document.querySelector('.map__pin--main');

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < window.ads.length; i++) {
    fragment.appendChild(window.renderMapPin(window.ads[i]));
  }

  var addMapPins = function () {
    mapPinsContainer.appendChild(fragment);
  };

  map.insertBefore(window.renderMapCard(window.ads[0]), mapFiltersContainer);

  var popup = map.querySelector('.popup');
  var pinsList = fragment.querySelectorAll('.map__pin');

  var removeFade = function () {
    map.classList.remove('map--faded');
  };

  var closePopup = function () {
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var deactivatePin = function (evt) {
    var target = evt.target;
    var btn = target.closest('button');
    if (!btn) {
      return;
    }
    for (i = 0; i < pinsList.length; i++) {
      mainPin.classList.remove('map__pin--active');
      pinsList[i].classList.remove('map__pin--active');
    }
  };

  var activatePin = function (evt) {
    var target = evt.target;
    var btn = target.closest('button');
    if (!btn) {
      return;
    }
    if (!mapPinsContainer.contains(btn)) {
      return;
    }
    btn.classList.add('map__pin--active');
  };

  var openPopup = function (evt) {
    var target = evt.target;
    var btn = target.closest('button');
    if (!btn) {
      return;
    }
    if (!mapPinsContainer.contains(btn)) {
      return;
    }
    if (btn === mainPin) {
      return;
    }

    for (i = 0; i < pinsList.length; i++) {
      if (btn === pinsList[i]) {
        map.removeChild(popup);
        var newCard = map.insertBefore(window.renderMapCard(window.ads[i]), mapFiltersContainer);
        popup = newCard;
        var popupClose = popup.querySelector('.popup__close');
        popup.classList.remove('hidden');
        popupClose.addEventListener('click', onPopupCloseClick);
        document.addEventListener('keydown', onPopupEscPress);
        return;
      }
    }
  };

  var onMainPinMouseup = function () {
    removeFade();
    addMapPins();
    window.form.formEnable();
    window.form.inputsDisable(false);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
      deactivatePin(event);
    }
  };

  var onPopupCloseClick = function () {
    closePopup();
    deactivatePin(event);
  };

  var onPinClick = function () {
    deactivatePin(event);
    activatePin(event);
    openPopup(event);
  };

  window.form.inputsDisable(true);
  closePopup(event);
  mainPin.addEventListener('mouseup', onMainPinMouseup);
  mapPinsContainer.addEventListener('click', onPinClick);

  // Перетаскивание метки

  var getCoords = function (elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top,
      left: box.left - pageXOffset
    };
  };

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

    var pinHeight = 84;
    var pinWidth = 62;

    var pickCoords = {
      x: getCoords(mainPin).left + pinWidth / 2,
      y: getCoords(mainPin).top + pinHeight
    };

    var pickShift = {
      x: moveEvt.pageX - pickCoords.x,
      y: moveEvt.pageY - pickCoords.y
    };

    console.log(pickShift);

    var newPosition = {
      x: mainPin.offsetLeft - shift.x + pickShift.x,
      y: mainPin.offsetTop - shift.y + pickShift.y
    };

    console.log(mainPin.offsetLeft);

    if (newPosition.y < 100) {
      newPosition.y = 100 + pickShift.y;
    } else if (newPosition.y > 500) {
      newPosition.y = 500 + pickShift.y;
    }
    mainPin.style.top = newPosition.y + 'px';
    mainPin.style.left = newPosition.x + 'px';

    var address = document.querySelector('#address');
    address.value = newPosition.x + ', ' + newPosition.y;
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
