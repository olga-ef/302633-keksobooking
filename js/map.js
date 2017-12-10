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
