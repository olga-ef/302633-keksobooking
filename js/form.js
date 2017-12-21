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
  var timeIn = noticeForm.querySelector('#timein');
  var timeOut = noticeForm.querySelector('#timeout');
  var houseType = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var submit = noticeForm.querySelector('.form__submit');
  var inputs = noticeForm.querySelectorAll('input');
  var resetButton = noticeForm.querySelector('.form__reset');

  // Функция синхронизации поля и значения
  var syncValues = function (element, value) {
    element.value = value;
  };

  // функция синхронизации поля и минимального значения
  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  // время въезда/ время выезда
  var OnTimeInChange = function () {
    window.synchronizeFields(timeIn, timeOut, TIME_VALUES, TIME_VALUES, syncValues);
  };

  var onTimeOutChange = function () {
    window.synchronizeFields(timeOut, timeIn, TIME_VALUES, TIME_VALUES, syncValues);
  };

  // Тип жилья/цена
  var OnHouseTypeChange = function () {
    window.synchronizeFields(houseType, price, TYPE_VALUES, MIN_PRICE_VALUES, syncValueWithMin);
  };

  // комнаты/гости
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

  // валидация по заголовку
  var onFormTitleInvalid = function () {
    if (formTitle.validity.tooShort) {
      formTitle.setCustomValidity('Минимальная длина заголовка — 30 символов');
    } else if (formTitle.validity.tooLong) {
      formTitle.setCustomValidity('Максимальная длина заголовка — 100 символов');
    } else if (formTitle.validity.valueMissing) {
      formTitle.setCustomValidity('Обязательное поле');
    } else {
      formTitle.setCustomValidity('');
    }
  };

  // валидация по цене
  var onPriceInvalid = function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Минимальная цена - ' + price.min);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Максимальная цена - ' + price.max);
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Обязательное поле');
    } else {
      price.setCustomValidity('');
    }
  };

  // делает красной рамку неправильно заполненного поля
  var checkValidity = function () {
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.checkValidity() === false) {
        input.style.borderColor = '#fa9';
      }
      input.style.borderColor = '#d9d9d3';
    }
  };

  var onSubmitClick = function () {
    checkValidity();
  };

    // функция возвращения формы в первоначальное состояние
  var resetNoticeForm = function () {
    formTitle.value = '';
    houseType.value = 'flat';
    price.value = '1000';
    timeIn.value = '12:00';
    timeOut.value = '12:00';
    roomNumber.value = '1';
    capacity.value = '1';

    for (var i = 0; i < features.length; i++) {
      features[i].checked = false;
    }
    description.value = '';
  };

  var onResetButtonClick = function () {
    resetNoticeForm();
  };

  // активирует форму
  var formEnable = function () {
    noticeForm.classList.remove('notice__form--disabled');
  };

  // блокирует все поля формы
  var inputsDisable = function (operator) {
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = operator;
    }
  };

  // синхронизирует все поля
  var synchronizeFields = function () {
    window.synchronizeFields(roomNumber, capacity, ROOMS, GUESTS, syncValues);
    window.synchronizeFields(timeOut, timeIn, TIME_VALUES, TIME_VALUES, syncValues);
    window.synchronizeFields(houseType, price, TYPE_VALUES, MIN_PRICE_VALUES, syncValueWithMin);
    window.synchronizeFields(roomNumber, capacity, ROOMS, GUESTS, syncValues);
    getCapacity();
  };

  // обработчик отправки формы на сервер
  var onNoticeFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(noticeForm), resetNoticeForm, window.backend.errorHandler);
  };

  // обработчики
  timeIn.addEventListener('change', OnTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
  noticeForm.addEventListener('submit', onNoticeFormSubmit);
  houseType.addEventListener('change', OnHouseTypeChange);
  roomNumber.addEventListener('change', onRoomNumberChange);
  submit.addEventListener('click', onSubmitClick);
  price.addEventListener('invalid', onPriceInvalid);
  formTitle.addEventListener('invalid', onFormTitleInvalid);
  resetButton.addEventListener('click', onResetButtonClick);

  window.form = {
    formEnable: formEnable,
    inputsDisable: inputsDisable,
    synchronizeFields: synchronizeFields
  };
})();
