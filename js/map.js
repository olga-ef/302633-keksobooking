'use strict';
(function () {

  // границы цен
  var PRICES_POINTS = {
    min: 10000,
    max: 50000
  };

  var ENTER_KEYCODE = 13;

  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var ads = [];
  // фильтры
  var mapFilters = map.querySelector('.map__filters');
  var housingTypeFilter = mapFilters.querySelector('#housing-type');
  var housingPriceFilter = mapFilters.querySelector('#housing-price');
  var housingRoomsFilter = mapFilters.querySelector('#housing-rooms');
  var housingGuestsFilter = mapFilters.querySelector('#housing-guests');
  var housingFeaturesFilter = mapFilters.querySelector('#housing-features');
  var housingFeatures = housingFeaturesFilter.querySelectorAll('input');

  // удаляет метки
  var removePins = function () {
    var mapPins = mapPinsContainer.querySelectorAll('.map__pin');
    mapPins.forEach(function (it) {
      if (it !== mainPin) {
        mapPinsContainer.removeChild(it);
      }
    });
  };
  // функция обновления пинов
  var updatePins = function () {
    var results = ads;

    var filterTypes = function () {
      if (housingTypeFilter.value !== 'any') {
        results = results.filter(function (it) {
          return it.offer.type === housingTypeFilter.value;
        });
      }
      return results;
    };
    var filterPrices = function () {
      if (housingPriceFilter.value !== 'any') {
        results = results.filter(function (it) {
          var priceFilterValues = {
            'middle': it.offer.price >= PRICES_POINTS.min && it.offer.price <= PRICES_POINTS.max,
            'low': it.offer.price < PRICES_POINTS.min,
            'high': it.offer.price > PRICES_POINTS.max
          };
          return priceFilterValues[housingPriceFilter.value];
        });
      }
      return results;
    };
    var filterRooms = function () {
      if (housingRoomsFilter.value !== 'any') {
        results = results.filter(function (it) {
          return it.offer.rooms.toString() === housingRoomsFilter.value;
        });
      }
      return results;
    };
    var filterGuests = function () {
      if (housingGuestsFilter.value !== 'any') {
        results = results.filter(function (it) {
          return it.offer.guests.toString() === housingGuestsFilter.value;
        });
      }
      return results;
    };

    var filterFeatures = function () {
      housingFeatures.forEach(function (feature) {
        if (feature.checked) {
          results = results.filter(function (it) {
            return it.offer.features.indexOf(feature.value) >= 0;
          });
        }
      });
      return results;
    };
    removePins();
    filterTypes();
    filterPrices();
    filterRooms();
    filterGuests();
    filterFeatures();
    window.pin.addMapPins(results);

    // обработчик клика по метке
    var onPinClick = function () {
      window.pin.deactivatePin(event);
      window.pin.activatePin(event);
      window.showCard(event, results);
    };
    mapPinsContainer.addEventListener('click', onPinClick);
  };

  // обработчик изменения значения фильтра
  mapFilters.addEventListener('change', updatePins);

  // удаляет затемнение с карты
  var removeFade = function () {
    map.classList.remove('map--faded');
  };

  var successHandler = function (data) {
    ads = window.random.getRandomArray(data);
  };

  // Активирует страницу при клике по главной метке
  var onMainPinMouseup = function () {
    removeFade();
    updatePins();
    window.form.formEnable();
    window.form.inputsDisable(false);
    window.form.synchronizeFields();
    mainPin.removeEventListener('mouseup', onMainPinMouseup);
    document.removeEventListener('keydown', onMainPinEnterPress);
  };

  var onMainPinEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      onMainPinMouseup();
    }
  };

  document.addEventListener('keydown', onMainPinEnterPress);

  // Изначальное состояние
  window.form.inputsDisable(true);
  mainPin.addEventListener('mouseup', onMainPinMouseup);
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
