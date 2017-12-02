'use strict';

var ESK_KEYCODE = 27;

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapPinsContainer = document.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var mapFiltersContainer = map.querySelector('.map__filters-container');

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
  var loc = {
    'x': getRandomInRange(300, 900) - 10,
    'y': getRandomInRange(100, 500)
  };
  var newObject = {
    'author': {
      'avatar': 'img/avatars/user' + getRandomElement(imageNumbers) + '.png'
    },
    'offer': {
      'title': getRandomElement(titles),
      'address': loc.x + ', ' + loc.y,
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
    'location': loc
  };
  ads.push(newObject);
}

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

// карточка

var renderMapCard = function (object) {
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
  for (i = 0; i < features.length; i++) {
    featuresList.removeChild(features[i]);
  }
  for (i = 0; i < object.offer.features.length; i++) {
    featuresList.appendChild(features[i]);
    features[i].classList.remove(features[i].classList[1]);
    features[i].classList.add('feature--' + object.offer.features[i]);
  }
  return cardElement;
};

map.insertBefore(renderMapCard(ads[0]), mapFiltersContainer);
inputsDisable();
closePopup();

var mainPin = document.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
var popup = map.querySelector('.popup');
var pinsList = fragment.querySelectorAll('.map__pin');

var removeFade = function () {
  map.classList.remove('map--faded');
};

var addMapPins = function () {
  mapPinsContainer.appendChild(fragment);
};

var formEnable = function () {
  noticeForm.classList.remove('notice__form--disabled');
};

var inputsEnable = function () {
  for (i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = false;
  }
};

var inputsDisable = function () {
  for (i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = true;
  }
};

var closePopup = function () {
  popup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEskPress);
};

var deactivatePin = function () {
  var target = event.target;
  var btn = target.closest('button');
  if (!btn) {
    return;
  }
  for (i = 0; i < pinsList.length; i++) {
    if (mainPin.classList.contains('map__pin--active')) {
      mainPin.classList.remove('map__pin--active');
    }
    if (pinsList[i].classList.contains('map__pin--active')) {
      pinsList[i].classList.remove('map__pin--active');
    }
  }
};

var activatePin = function () {
  var target = event.target;
  var btn = target.closest('button');
  if (!btn) {
    return;
  }
  if (!mapPinsContainer.contains(btn)) {
    return;
  }
  btn.classList.add('map__pin--active');
};

var openPopup = function () {
  var target = event.target;
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
      var newCard = map.insertBefore(renderMapCard(ads[i]), mapFiltersContainer);
      popup = newCard;
      var popupClose = popup.querySelector('.popup__close');
      popup.classList.remove('hidden');
      popupClose.addEventListener('click', onPopupCloseClick);
      document.addEventListener('keydown', onPopupEskPress);
      return;
    }
  }
};

var onMainPinMouseup = function () {
  removeFade();
  addMapPins();
  formEnable();
  inputsEnable();
};

var onPopupEskPress = function (event) {
  if (event.keyCode === ESK_KEYCODE) {
    closePopup();
    deactivatePin();
  }
};

var onPopupCloseClick = function () {
  closePopup();
  deactivatePin();
};

var onPinClick = function () {
  deactivatePin();
  activatePin();
  openPopup();
};

mainPin.addEventListener('mouseup', onMainPinMouseup);
mapPinsContainer.addEventListener('click', onPinClick);
