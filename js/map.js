'use strict';
(function () {

  // границы цен
  var PricesPoint = {
    MIN: 10000,
    MAX: 50000
  };
  // Размеры главного пина
  var MainPinSize = {
    HEIGHT: 62,
    PICK_HEIGHT: 22
  };
  // Границы перемещения пина
  var Border = {
    MIN_Y: 100,
    MAX_Y: 500
  };
  var UPDATE_INTERVAL = 500; // 0.5s

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

    for (var i = 0; i < mapPins.length; i++) {
      if (mapPins[i] !== mainPin) {
        mapPinsContainer.removeChild(mapPins[i]);
      }
    }
  };
  // функция обновления пинов
  var updatePins = function () {
    var results = ads;

    // фильтр по значению
    var filterByValue = function (filterValue, property) {
      if (filterValue !== 'any') {
        results = results.filter(function (it) {
          return it.offer[property].toString() === filterValue;
        });
      }
      return results;
    };

    // фильтр по цене
    var filterPrices = function () {
      if (housingPriceFilter.value !== 'any') {
        results = results.filter(function (it) {
          var priceFilterValues = {
            'middle': it.offer.price >= PricesPoint.MIN && it.offer.price <= PricesPoint.MAX,
            'low': it.offer.price < PricesPoint.MIN,
            'high': it.offer.price > PricesPoint.MAX
          };
          return priceFilterValues[housingPriceFilter.value];
        });
      }
      return results;
    };

    // фильтр по особенностям
    var filterFeatures = function () {
      for (var i = 0; i < housingFeatures.length; i++) {
        if (housingFeatures[i].checked) {
          results = results.filter(function (it) {
            return it.offer.features.indexOf(housingFeatures[i].value) >= 0;
          });
        }
      }
      return results;
    };

    removePins();
    filterByValue(housingTypeFilter.value, 'type');
    filterPrices();
    filterByValue(housingRoomsFilter.value, 'rooms');
    filterByValue(housingGuestsFilter.value, 'guests');
    filterFeatures();
    window.pin.addMapPins(results);
  };

  // обработчик изменения значения фильтра
  mapFilters.addEventListener('change', function () {
    window.util.debounce(updatePins, UPDATE_INTERVAL);
  });

  // удаляет затемнение с карты
  var removeFade = function () {
    map.classList.remove('map--faded');
  };

  var successHandler = function (data) {
    ads = window.util.getRandomArray(data);
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
    window.util.isEnterPress(evt, onMainPinMouseup);
  };

  mainPin.addEventListener('keydown', onMainPinEnterPress);

  // обработчик клика по метке
  var onPinClick = function (evt) {
    var clickedPin = evt.target.closest('button');
    if (!clickedPin || !mapPinsContainer.contains(clickedPin) || clickedPin === mainPin) {
      return;
    }
    window.pin.deactivatePin();
    window.pin.activatePin(clickedPin);
    window.showCard(clickedPin);
  };

  mapPinsContainer.addEventListener('click', onPinClick);

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

  var addAddress = function (x, y) {
    var address = document.querySelector('#address');
    address.value = x + ', ' + y;
  };

  var getMainPinPosition = function (moveEvt, coords) {
    var topEdge = Border.MIN_Y - MainPinSize.HEIGHT / 2 - MainPinSize.PICK_HEIGHT;
    var bottomEdge = Border.MAX_Y - MainPinSize.HEIGHT / 2 - MainPinSize.PICK_HEIGHT;

    var shift = {
      x: coords.x - moveEvt.pageX,
      y: coords.y - moveEvt.pageY
    };

    var newPosition = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    var pickCoords = {
      x: newPosition.x,
      y: newPosition.y + MainPinSize.HEIGHT / 2 + MainPinSize.PICK_HEIGHT
    };

    if (newPosition.y < topEdge) {
      newPosition.y = topEdge;
    } else if (newPosition.y > bottomEdge) {
      newPosition.y = bottomEdge;
    }
    mainPin.style.top = newPosition.y + 'px';
    mainPin.style.left = newPosition.x + 'px';
    addAddress(pickCoords.x, pickCoords.y);
  };

  var onMainPinMousedown = function (evt) {
    evt.preventDefault();
    var startCoords = getStartCoords(evt);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      getMainPinPosition(moveEvt, startCoords);
      startCoords = getStartCoords(moveEvt);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainPin.addEventListener('mousedown', onMainPinMousedown);
})();
