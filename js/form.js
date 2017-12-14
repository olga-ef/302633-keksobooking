'use strict';
(function () {

  var TIME_VALUES = ['12:00', '13:00', '14:00'];
  var TYPE_VALUES = ['flat', 'bungalo', 'house', 'palace'];
  var MIN_PRICE_VALUES = [1000, 0, 5000, 10000];
  var ROOMS = ['1', '2', '3', '100'];
  var GUESTS = ['1', '2', '3', '0'];

  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  var formTitle = noticeForm.querySelector('#title');
  var features = noticeForm.querySelectorAll('.features input');
  var description = noticeForm.querySelector('#description');


  // Функция синхронизации поля и значения
  var syncValues = function (element, value) {
    element.value = value;
  };

  // функция синхронизации поля и минимального значения
  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  // время въезда/ время выезда
  var timeIn = noticeForm.querySelector('#timein');
  var timeOut = noticeForm.querySelector('#timeout');

  var OnTimeInChange = function () {
    window.synchronizeFields(timeIn, timeOut, TIME_VALUES, TIME_VALUES, syncValues);
  };

  var onTimeOutChange = function () {
    window.synchronizeFields(timeOut, timeIn, TIME_VALUES, TIME_VALUES, syncValues);
  };

  timeIn.addEventListener('change', OnTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);

  // Тип жилья/цена
  var houseType = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');

  var OnHouseTypeChange = function () {
    window.synchronizeFields(houseType, price, TYPE_VALUES, MIN_PRICE_VALUES, syncValueWithMin);
  };

  houseType.addEventListener('change', OnHouseTypeChange);

  // комнаты/гости

  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');

  var getCapacity = function () {
    var option = roomNumber.options[roomNumber.selectedIndex];
    var roomValue = option.value;

    for (var i = 0; i < roomNumber.options.length; i++) {
      var capacityValue = capacity.options[i].value;
      capacity.options[i].disabled = true;

      if (roomValue === '100' && capacityValue === '0') {
        capacity.options[3].disabled = false;
      } else if (capacityValue <= roomValue && capacityValue > 0 && roomValue !== '100') {
        capacity.options[i].disabled = false;
      }
    }
  };

  var onRoomNumberChange = function () {
    window.synchronizeFields(roomNumber, capacity, ROOMS, GUESTS, syncValues);
    getCapacity();
  };

  roomNumber.addEventListener('change', onRoomNumberChange);

  // валидация
  var submit = noticeForm.querySelector('.form__submit');
  var inputs = noticeForm.querySelectorAll('input');

  var checkValidity = function () {
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.checkValidity() === false) {
        input.style.borderColor = '#fa9';
      } else {
        input.style.borderColor = '#d9d9d3';
      }
    }
  };

  var onSubmitClick = function () {
    checkValidity();
  };

  submit.addEventListener('click', onSubmitClick);

  // функция возвращения формы в первоначальное состояние
  var recetNoticeForm = function () {
    formTitle.value = '';
    houseType.value = 'flat';
    price.value = '1000';
    timeIn.value = '12:00';
    timeOut.value = '12:00';
    roomNumber.value = '1';
    capacity.value = '1';
    features.forEach(function (item) {
      item.checked = false;
    });
    description.value = '';
  };

  // обработчик отправки формы на сервер
  var onNoticeFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(noticeForm), recetNoticeForm, window.backend.errorHandler);
  };

  // событие отправки формы на сервер
  noticeForm.addEventListener('submit', onNoticeFormSubmit);

  window.form = {
    formEnable: function () {
      noticeForm.classList.remove('notice__form--disabled');
    },
    inputsDisable: function (operator) {
      for (var i = 0; i < noticeFormFieldsets.length; i++) {
        noticeFormFieldsets[i].disabled = operator;
      }
    },
    synchronizeFields: function () {
      window.synchronizeFields(roomNumber, capacity, ROOMS, GUESTS, syncValues);
      window.synchronizeFields(timeOut, timeIn, TIME_VALUES, TIME_VALUES, syncValues);
      window.synchronizeFields(houseType, price, TYPE_VALUES, MIN_PRICE_VALUES, syncValueWithMin);
      window.synchronizeFields(roomNumber, capacity, ROOMS, GUESTS, syncValues);
      getCapacity();
    }
  };
})();
