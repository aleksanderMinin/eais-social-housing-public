'use strict';

module.exports = function(environment) {
  // По-умолчанию - бэкенд внутри того же докер контейнера
  let backendUrl = '';

  if (environment === 'localhost') {
    backendUrl = 'http://localhost:6500';
  }

  if (environment === 'remote-backend') {
    backendUrl = 'http://10.130.5.126:8091';
  }

  let ENV = {
    modulePrefix: 'eais-public',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
      },
      EXTEND_PROTOTYPES: {
        // Предотвращаем переопределение метода Date.parse аддон-ом Ember Data.
        Date: false
      }
    },

    APP: {
      backendUrls: {
        root: backendUrl,
        odata: backendUrl + '/odata',
        webapi: backendUrl + '/api'
      }
    },

    // Задаем набор иконок, которые в итоге будут включены в приложение.
    // Наборы иконок 'free-solid-svg-icons', 'free-regular-svg-icons', 'free-brands-svg-icons' уже установлены.
    // Чтобы добавить в приложение все иконки в наборе, нужно добавить настройку '<имя набора>': 'all',
    // например 'free-regular-svg-icons': 'all' или 'free-regular-svg-icons': 'all',
    // а чтобы добавить только необходимые иконки из набора, нужно добавить настройку '<имя набора>': [<имя иконки в наборе>, ...],
    // например 'free-solid-svg-icons': ['long-arrow-alt-left'],
    // подробную документацию см. в readme-проекта: https://github.com/FortAwesome/ember-fontawesome#subsetting-icons.
    fontawesome: {
      icons: {
        'free-solid-svg-icons': [
          'long-arrow-alt-left',
          'sign-in-alt',
          'sign-out-alt',
          'times',
          'arrow-right',
          'arrow-down',
          'search',
          'chevron-down',
          'chevron-up',
          'sync'
        ],
        'free-regular-svg-icons': [
          'calendar-alt'
        ]
      }
    },

    // Задем настройки для moment-а,
    // подробную документацию см. в readme-проекта: https://github.com/stefanpenner/ember-moment#configuration-options.
    moment: {
      includeLocales: ['ru'],
      outputFormat: 'L'
    }
  };

  if (environment === 'test') {
    // Testem предпочитает такой locationType.
    ENV.locationType = 'none';

    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'development') {
  }

  if (environment === 'production') {
  }

  return ENV;
};
