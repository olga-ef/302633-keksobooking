'use strict';

(function () {
  // карточка
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

  // функция, добавляющая фотографии

  var addPhotos = function (element, ad) {
    var picturesList = element.querySelector('.popup__pictures');
    var pictureContainer = element.querySelector('.popup__pictures li');

    picturesList.removeChild(pictureContainer);

    for (var i = 0; i < ad.offer.photos.length; i++) {
      var photoItem = document.createElement('li');
      var photo = document.createElement('img');

      picturesList.appendChild(photoItem);
      photoItem.appendChild(photo);
      photo.src = ad.offer.photos[i];
    }
  };

  window.renderMapCard = function (ad) {
    var cardElement = mapCardTemplate.cloneNode(true);

    cardElement.querySelector('h3').textContent = ad.offer.title;
    cardElement.querySelector('p small').textContent = ad.offer.address;
    cardElement.querySelector('.popup__price').textContent = ad.offer.price + ' \u20bd/ночь';

    if (ad.offer.type === 'flat') {
      cardElement.querySelector('h4').textContent = 'Квартира';
    }
    if (ad.offer.type === 'bungalo') {
      cardElement.querySelector('h4').textContent = 'Бунгало';
    } else {
      cardElement.querySelector('h4').textContent = 'Дом';
    }

    cardElement.querySelectorAll('p')[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    cardElement.querySelectorAll('p')[4].textContent = ad.offer.description;
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

    var featuresList = cardElement.querySelector('.popup__features');
    var features = cardElement.querySelector('.popup__features').querySelectorAll('.feature');
    for (var i = 0; i < features.length; i++) {
      featuresList.removeChild(features[i]);
    }
    for (i = 0; i < ad.offer.features.length; i++) {
      featuresList.appendChild(features[i]);
      features[i].classList.remove(features[i].classList[1]);
      features[i].classList.add('feature--' + ad.offer.features[i]);
    }
    addPhotos(cardElement, ad);

    return cardElement;
  };
})();
