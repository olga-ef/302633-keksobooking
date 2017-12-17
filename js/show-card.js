'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mainPin = document.querySelector('.map__pin--main');

  // функсия вставляет карточку карточку
  var insertCard = function (parentObject, nextObject, cardNumber, ads) {
    parentObject.insertBefore(window.renderMapCard(ads[cardNumber]), nextObject);
  };

  // функция удаляет попап, если, он есть
  var removePopup = function () {
    var popup = map.querySelector('.popup');
    if (popup) {
      map.removeChild(popup);
    }
  };

  // функкция закрывает попап
  var closePopup = function () {
    var popup = map.querySelector('.popup');
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // функция закрывает попап при нажатии esc
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
      window.pin.deactivatePin(event);
    }
  };

  // обработчик клика по крестику
  var onPopupCloseClick = function () {
    closePopup();
    window.pin.deactivatePin(event);
  };

  // открывает карточку
  window.showCard = function (evt, data) {
    var pinsList = mapPinsContainer.querySelectorAll('.map__pin');


    var target = evt.target;
    var btn = target.closest('button');
    if (!btn || !mapPinsContainer.contains(btn) || btn === mainPin) {
      return;
    }
    for (var i = 0; i < pinsList.length - 1; i++) {
      if (btn === pinsList[i + 1]) {
        removePopup();
        insertCard(map, mapFiltersContainer, i, data);
        var popup = map.querySelector('.popup');
        var popupClose = popup.querySelector('.popup__close');
        popup.classList.remove('hidden');
        popupClose.addEventListener('click', onPopupCloseClick);
        document.addEventListener('keydown', onPopupEscPress);
        return;
      }
    }
  };
})();
