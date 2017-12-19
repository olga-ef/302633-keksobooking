'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mainPin = document.querySelector('.map__pin--main');

  // добавляет карточку на карту
  var insertCard = function (parentObject, nextObject, card) {
    parentObject.insertBefore(window.renderMapCard(card), nextObject);
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
  window.showCard = function (evt) {
    var target = evt.target;
    var btn = target.closest('button');
    if (!btn || !mapPinsContainer.contains(btn) || btn === mainPin) {
      return;
    }

    window.pin.cardsDataMap.forEach(function (it) {
      if (btn === it.elem) {
        removePopup();
        insertCard(map, mapFiltersContainer, it.obj);
        var popup = map.querySelector('.popup');
        var popupClose = popup.querySelector('.popup__close');
        popup.classList.remove('hidden');
        popupClose.addEventListener('click', onPopupCloseClick);
        document.addEventListener('keydown', onPopupEscPress);
        return;
      }
    });
  };
})();
