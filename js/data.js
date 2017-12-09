'use strict';

(function () {
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

  window.ads = [];
  for (var i = 0; i < 8; i++) {
    var loc = {
      'x': window.random.getRandomInRange(300, 900) - 10,
      'y': window.random.getRandomInRange(100, 500)
    };
    var newObject = {
      'author': {
        'avatar': 'img/avatars/user' + window.random.getRandomElement(imageNumbers) + '.png'
      },
      'offer': {
        'title': window.random.getRandomElement(titles),
        'address': loc.x + ', ' + loc.y,
        'price': window.random.getRandomInRange(1000, 1000000),
        'type': housesTypes[window.random.getRandomIndex(housesTypes)],
        'rooms': window.random.getRandomInRange(1, 5),
        'guests': window.random.getRandomInRange(1, 10),
        'checkin': times[window.random.getRandomIndex(times)],
        'checkout': times[window.random.getRandomIndex(times)],
        'features': window.random.getRandomArray(housesFeatures),
        'description': '',
        'photos': []
      },
      'location': loc
    };
    window.ads.push(newObject);
  }
})();
