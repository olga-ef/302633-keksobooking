'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

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
    removePopup();
    window.pin.deactivatePin();
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // функция закрывает попап при нажатии esc
  var onPopupEscPress = function (event) {
    window.util.isEscPress(event, closePopup);
  };

  // обработчик клика по крестику
  var onPopupCloseClick = function () {
    closePopup();
  };

  // добавляет обработчики попапа
  var addPopupHandlers = function () {
    var popup = map.querySelector('.popup');
    var popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);
  };

  // открывает карточку
  window.showCard = function (clickedPin) {
    window.pin.cardsDataMap.forEach(function (it) {
      if (clickedPin === it.elem) {
        removePopup();
        insertCard(map, mapFiltersContainer, it.obj);
        addPopupHandlers();
        return;
      }
    });
  };
})();
