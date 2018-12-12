import Service from '@ember/service';
import RSVP from 'rsvp';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import config from '../config/environment';
import moment from 'moment';

/**
  Сервис "сессий".
  Хранит информацию о текущем пользователе, и предоставляет методы для аутентификации в приложении и выхода из него.

  @class SessionService
  @extends <a href="https://emberjs.com/api/ember/3.5/classes/Service">@ember/service</a>
*/
export default Service.extend({
  /**
    Ссылка на сервис работы с роутами.
  */
  router: service('router'),

  /**
    Ссылка на сервис работы с cookies.
  */
  cookies: service('cookies'),

  /**
    Идентификатор текущего пользователя.

    @property userId
    @type String
  */
  userId: null,

  /**
    Publickey личности в блокчейн

    @type String
   */
  userPkLichnost: null,

  /**
    Флаг: аутентифицирован ли какой-либо пользоатель в приложении или нет.

    @property signedIn
    @type Boolean
    @readOnly
  */
  isSignedIn: computed('userId', function () {
    return !isBlank(this.get('userId'));
  }),

  /**
    Инициализирует сервис.
  */
  init() {
    this._super(...arguments);

    let cookies = this.get('cookies');
    if (cookies.exists('userId'))
    {
      this.set('userId', cookies.read('userId'));
    }

    if (cookies.exists('userPkLichnost')) {
      this.set('userPkLichnost', cookies.read('userPkLichnost'));
    }
  },

  /**
    Осуществляет вход пользователя в приложение.

    @method signIn
    @param {String} login Логин пользователя.
    @param {String} password Пароль пользователя.
    @return {Promise<any>} Промис, возвращающий информацию о результете выполнения входа пользователя в приложение.
  */
  signIn(login, password) {
    let cookies = this.get('cookies');

    this.set('userId', null);
    cookies.clear('userId');

    return new RSVP.Promise((resolve, reject) => {
      run(() => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    }).then(() => {
      this.set('userId', login);
      cookies.write('userId', login);
      this.getUserData(login);
    });
  },

  /**
    Осуществляет выход пользователя из приложения.

    @method signOut
    @return {Promise<any>} Промис, возвращающий информацию о результете выполнения выхода пользователя из приложения.
  */
  signOut() {
    let cookies = this.get('cookies');

    return new RSVP.Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    }).then(() => {
      this.set('userId', null);
      this.set('userPkLichnost', null);
      cookies.clear('userId');
      cookies.clear('userPkLichnost');
    });
  },

  /**
    Запрос публичного ключа пользователя в ОЖ

    @param {String} login
    @return {Promise<string>}
   */
  getUserData(login) {
    // TODO: добавить отправку запроса в РСАА userinfo_endpoint
    return new RSVP.Promise((resolve, reject) => {
      run(() => {
        setTimeout(() => {
          resolve({
            familia: 'Колыванов',
            imia: 'Сабина',
            otchestvo: 'Владимиривна',
            data_roshdeniia: moment.utc("1988-03-15").toISOString(),
            pasport_seria: '57 04 3',
            pasport_number: 849370,
          });
        }, 500);
      });
    }).then(data => {
      const url = `${config.APP.backendUrls.webapi}/Service/QueryPkLichnost`;
      const queryData = {
        f: data.familia,
        i: data.imia,
        o: data.otchestvo,
        dr: data.data_roshdeniia,
        ser: data.pasport_seria,
        num: data.pasport_number
      };

      $.post(url, queryData, (pk) => {
        if (pk && pk !== 'null') {
          this.get('cookies').write('userPkLichnost', pk);
          this.set('userPkLichnost', pk);
        } else {
          window.console.error('Не найден публичный ключ пользователя');
        }
      }).fail(() => {
        run(() => {
          window.console.error('Не найден публичный ключ пользователя');
        });
      });
    });
  }
});
