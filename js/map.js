'use strict';

var ESC_KEYCODE = 27;

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

var inputsDisable = function (operator) {
  for (i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = operator;
  }
};

var closePopup = function () {
  popup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

var deactivatePin = function (evt) {
  var target = evt.target;
  var btn = target.closest('button');
  if (!btn) {
    return;
  }
  for (i = 0; i < pinsList.length; i++) {
    mainPin.classList.remove('map__pin--active');
    pinsList[i].classList.remove('map__pin--active');
  }
};

var activatePin = function (evt) {
  var target = evt.target;
  var btn = target.closest('button');
  if (!btn) {
    return;
  }
  if (!mapPinsContainer.contains(btn)) {
    return;
  }
  btn.classList.add('map__pin--active');
};

var openPopup = function (evt) {
  var target = evt.target;
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
      document.addEventListener('keydown', onPopupEscPress);
      return;
    }
  }
};

var onMainPinMouseup = function () {
  removeFade();
  addMapPins();
  formEnable();
  inputsDisable(false);
};

var onPopupEscPress = function () {
  if (event.keyCode === ESC_KEYCODE) {
    closePopup();
    deactivatePin(event);
  }
};

var onPopupCloseClick = function () {
  closePopup();
  deactivatePin(event);
};

var onPinClick = function () {
  deactivatePin(event);
  activatePin(event);
  openPopup(event);
};

inputsDisable(true);
closePopup(event);
mainPin.addEventListener('mouseup', onMainPinMouseup);
mapPinsContainer.addEventListener('click', onPinClick);

// форма въезда/выезда
var timeIn = noticeForm.querySelector('#timein');
var timeOut = noticeForm.querySelector('#timeout');

var selectTime = function (input1, input2) {
  for (i = 0; i < input1.options.length; i++) {
    var option = input1.options[i];
    if (option.selected) {
      input2.options[i].selected = true;
    }
  }
};

var OnTimeInChange = function () {
  selectTime(timeIn, timeOut);
};

var onTimeOutChange = function () {
  selectTime(timeOut, timeIn)
}

timeIn.addEventListener('change', OnTimeInChange);
timeOut.addEventListener('change', onTimeOutChange);


// Тип жилья/цена
var houseType = noticeForm.querySelector('#type');
var price = noticeForm.querySelector('#price')

var getMinPrice = function () {
  if (houseType.value === 'flat') {
    price.min = 1000;
  } else if (houseType.value === 'house') {
    price.min = 5000;
  } else if (houseType.value === 'palace') {
    price.min = 10000;
  } else if (houseType.value === 'bungalo') {
    price.min = 0;
  }
};

var OnHouseTypeChange = function () {
  getMinPrice();
};

houseType.addEventListener('change', OnHouseTypeChange);

// комнаты/гости

var roomNumber = noticeForm.querySelector('#room_number');
var capacity = noticeForm.querySelector('#capacity');

var getCapacity = function () {
  var option = roomNumber.options[roomNumber.selectedIndex];
  if (option.value == 1) {
    capacity.options[0].disabled = true;
    capacity.options[1].disabled = true;
    capacity.options[3].disabled = true;
    capacity.options[2].selected = true;
    capacity.options[2].disabled = false;
  } else if (option.value == 2)  {
    capacity.options[0].disabled = true;
    capacity.options[1].disabled = false;
    capacity.options[3].disabled = true;
    capacity.options[2].selected = true;
    capacity.options[2].disabled = false;
  } else if (option.value == 3)  {
    capacity.options[0].disabled = false;
    capacity.options[1].disabled = false;
    capacity.options[3].disabled = true;
    capacity.options[2].selected = true;
    capacity.options[2].disabled = false;
  } else if (option.value == 100)  {
    capacity.options[0].disabled = true;
    capacity.options[1].disabled = true;
    capacity.options[3].disabled = false;
    capacity.options[3].selected = true;
    capacity.options[2].disabled = true;
  }
};


var onRoomNumberChange = function () {
  getCapacity();
};

roomNumber.addEventListener('change', onRoomNumberChange);
getCapacity();



// валидация
var submit = noticeForm.querySelector('.form__submit');
var inputs = noticeForm.querySelectorAll('input')

var checkValidity = function() {
  for (i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (input.checkValidity() === false) {
      input.style.borderColor = '#fa9';
      console.log(input);
    } else {
      input.style.borderColor = '#d9d9d3';
    }
  }
}

var onSubmitClick = function() {
  checkValidity();
};

submit.addEventListener('click', onSubmitClick);
