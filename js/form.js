'use strict';
(function () {
  // форма въезда/выезда
  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  var timeIn = noticeForm.querySelector('#timein');
  var timeOut = noticeForm.querySelector('#timeout');

  window.form = {
    formEnable: function () {
      noticeForm.classList.remove('notice__form--disabled');
    },

    inputsDisable: function (operator) {
      for (var i = 0; i < noticeFormFieldsets.length; i++) {
        noticeFormFieldsets[i].disabled = operator;
      }
    }
  };

  var selectTime = function (input1, input2) {
    for (var i = 0; i < input1.options.length; i++) {
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
    selectTime(timeOut, timeIn);
  };

  timeIn.addEventListener('change', OnTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);

  // Тип жилья/цена
  var houseType = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');

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
    if (option.value === '1') {
      capacity.options[0].disabled = true;
      capacity.options[1].disabled = true;
      capacity.options[3].disabled = true;
      capacity.options[2].selected = true;
      capacity.options[2].disabled = false;
    } else if (option.value === '2') {
      capacity.options[0].disabled = true;
      capacity.options[1].disabled = false;
      capacity.options[3].disabled = true;
      capacity.options[2].selected = true;
      capacity.options[2].disabled = false;
    } else if (option.value === '3') {
      capacity.options[0].disabled = false;
      capacity.options[1].disabled = false;
      capacity.options[3].disabled = true;
      capacity.options[2].selected = true;
      capacity.options[2].disabled = false;
    } else if (option.value === '100') {
      capacity.options[0].disabled = true;
      capacity.options[1].disabled = true;
      capacity.options[3].disabled = false;
      capacity.options[3].selected = true;
      capacity.options[2].disabled = true;
    }
  };

  var onRoomNumberChange = getCapacity;

  roomNumber.addEventListener('change', onRoomNumberChange);
  getCapacity();

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
})();
