'use strict';

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapPinsContainer = document.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

var imageNumbers = ['01', '02', '03', '04', '05', '06', '07', '08'];
var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var housesTypes = ['flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var housesFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// случайный индекс

var getRandomIndex = function (array) {
  return Math.floor(Math.random() * array.length);
};

// случайное целое число в диапазоне

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// случайный неповторяющийся элемент массива

var getRandomElement = function (array) {
  var arrayCopy = array;
  var randomIndex = getRandomIndex(arrayCopy);
  var randomElement = arrayCopy[randomIndex];
  arrayCopy.splice(randomIndex, 1);

  return randomElement;
};

// массив случайной длины

var getRandomArray = function (array) {
  var arrayCopy = array;
  for (var i = arrayCopy.length - 1; i > 0; i--) {
    var randomIndex = getRandomIndex(arrayCopy);
    var randomElement = arrayCopy[randomIndex];
    arrayCopy[randomIndex] = arrayCopy[i];
    arrayCopy[i] = randomElement;
  }
  return arrayCopy.slice(getRandomIndex(arrayCopy));
};

var ads = [];
for (var i = 0; i < 8; i++) {

  var newObject = {
    'author': {
      'avatar': 'img/avatars/user' + getRandomElement(imageNumbers) + '.png'
    },
    'offer': {
      'title': getRandomElement(titles),
      'address': location.x + ', ' + location.y,
      'price': getRandomInRange(1000, 1000000),
      'type': housesTypes[getRandomIndex(housesTypes)],
      'rooms': getRandomInRange(1, 5),
      'guests': getRandomInRange(1, 10),
      'checkin': times[getRandomIndex(times)],
      'checkout': times[getRandomIndex(times)],
      'features': getRandomArray(housesFeatures),
      'description': '',
      'photos': []
    },
    'location': {
      'x': getRandomInRange(300, 900) - 10,
      'y': getRandomInRange(100, 500)
    }
  };
  ads.push(newObject);
}

map.classList.remove('map--faded');

// метки на карте

var renderMapPin = function (object) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style.left = object.location.x + 'px';
  pinElement.style.top = object.location.y + 'px';
  pinElement.querySelector('img').src = object.author.avatar;

  return pinElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < ads.length; i++) {
  fragment.appendChild(renderMapPin(ads[i]));
}

mapPinsContainer.appendChild(fragment);

// карточка

var renderMapCard = function () {
  var cardElement = mapCardTemplate.cloneNode(true);

  cardElement.querySelector('h3').textContent = ads[0].offer.title;
  cardElement.querySelector('p small').textContent = ads[0].address;
  cardElement.querySelector('.popup__price').textContent = ads[0].offer.price + ' &#x20bd;/ночь';

  if (ads[0].offer.type === 'flat') {
    cardElement.querySelector('h4').textContent = 'Квартира';
  }
  if (ads[0].offer.type === 'bungalo') {
    cardElement.querySelector('h4').textContent = 'Бунгало';
  } else {
    cardElement.querySelector('h4').textContent = 'Дом';
  }

  cardElement.querySelectorAll('p')[2].textContent = ads[0].offer.rooms + ' комнаты для ' + ads[0].offer.guests + ' гостей';
  cardElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + ads[0].offer.checkout;
  cardElement.querySelectorAll('p')[4].textContent = ads[0].offer.description;
  cardElement.querySelector('.popup__avatar').src = ads[0].author.avatar;

  var featuresList = cardElement.querySelector('.popup__features');
  var features = cardElement.querySelector('.popup__features').querySelectorAll('.feature');
  for (i = 0; i < features.length; i++) {
    featuresList.removeChild(features[i]);
  }
  for (i = 0; i < ads[0].offer.features.length; i++) {
    featuresList.appendChild(features[i]);
    features[i].classList.remove(features[i].classList[1]);
    features[i].classList.add('feature--' + ads[0].offer.features[i]);
  }

  return cardElement;
};

map.appendChild(renderMapCard());
