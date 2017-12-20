'use strict';

(function () {
  var URL_SAVE = 'https://1510.dump.academy/keksobooking';
  var URL_LOAD = 'https://1510.dump.academy/keksobooking/data';
  var STATUS_OK = 200;
  var TIMEOUT = 10000; // 10s

  var setXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {

      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус ' + xhr.status + ' ' + xhr.status.text);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполнится за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT;

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = setXhr(onLoad, onError);
    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = setXhr(onLoad, onError);
    xhr.open('POST', URL_SAVE);
    xhr.send(data);
  };
  var errorHandler = function (errorMessage) {
    var errorWindow = document.createElement('div');
    errorWindow.style = 'z-index: 100; margin: 0 auto; padding: 10px 0; text-align: center; background-color: #db3d15;';
    errorWindow.style.position = 'fixed';
    errorWindow.style.top = 0;
    errorWindow.style.width = '100%';
    errorWindow.style.fontSize = '20px';
    errorWindow.style.color = '#fff';

    errorWindow.textContent = errorMessage;
    document.body.appendChild(errorWindow);
  };
  window.backend = {
    load: load,
    save: save,
    errorHandler: errorHandler
  };
})();
