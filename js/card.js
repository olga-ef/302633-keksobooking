'use strict';

(function () {
  // карточка
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

  window.renderMapCard = function (object) {
    var cardElement = mapCardTemplate.cloneNode(true);

    cardElement.querySelector('h3').textContent = object.offer.title;
    cardElement.querySelector('p small').textContent = object.offer.address;
    cardElement.querySelector('.popup__price').textContent = object.offer.price + ' \u20bd/ночь';

    if (object.offer.type === 'flat') {
      cardElement.querySelector('h4').textContent = 'Квартира';
    }
    if (object.offer.type === 'bungalo') {
      cardElement.querySelector('h4').textContent = 'Бунгало';
    } else {
      cardElement.querySelector('h4').textContent = 'Дом';
    }

    cardElement.querySelectorAll('p')[2].textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    cardElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    cardElement.querySelectorAll('p')[4].textContent = object.offer.description;
    cardElement.querySelector('.popup__avatar').src = object.author.avatar;

    var featuresList = cardElement.querySelector('.popup__features');
    var features = cardElement.querySelector('.popup__features').querySelectorAll('.feature');
    for (var i = 0; i < features.length; i++) {
      featuresList.removeChild(features[i]);
    }
    for (i = 0; i < object.offer.features.length; i++) {
      featuresList.appendChild(features[i]);
      features[i].classList.remove(features[i].classList[1]);
      features[i].classList.add('feature--' + object.offer.features[i]);
    }
    return cardElement;
  };
})();
