'use strict';

(function () {
  // карточка
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var houseTypesMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

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


  // добавляет особенности
  var addFeatures = function (element, ad) {
    var featuresList = element.querySelector('.popup__features');
    var features = element.querySelector('.popup__features').querySelectorAll('.feature');

    for (var i = 0; i < features.length; i++) {
      featuresList.removeChild(features[i]);
    }

    ad.offer.features.forEach(function (featureItem, index) {
      featuresList.appendChild(features[index]);
      features[index].classList.remove(features[index].classList[1]);
      features[index].classList.add('feature--' + featureItem);
    });
  };

  window.renderMapCard = function (ad) {
    var cardElement = mapCardTemplate.cloneNode(true);

    cardElement.querySelector('h3').textContent = ad.offer.title;
    cardElement.querySelector('p small').textContent = ad.offer.address;
    cardElement.querySelector('.popup__price').textContent = ad.offer.price + ' \u20bd/ночь';
    cardElement.querySelector('h4').textContent = houseTypesMap[ad.offer.type];
    cardElement.querySelectorAll('p')[2].textContent =
      ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardElement.querySelectorAll('p')[3].textContent =
      'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    cardElement.querySelectorAll('p')[4].textContent = ad.offer.description;
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
    addFeatures(cardElement, ad);
    addPhotos(cardElement, ad);

    return cardElement;
  };
})();
