import Controller from '@ember/controller';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  /**
    Ссылка на сервис "сессий".
  */
  session: service('session'),

  /**
    Ошибка, которую нужно отобразить.

    @property error
    @type Object
    @default null
  */
  error: null,

  /**
    Сообщение об ошибке.

    @property errorMessage
    @type String
    @default readOnly
  */
  errorMessage: computed('error', function() {
    let error = get(this, 'error') || '';

    return error.message || error;
  }),

  /**
    Информация, которую нужно отобразить.

    @property information
    @type Object
    @default null
  */
  information: null,

  /**
    Информационное сообщение.

    @property errorMessage
    @type String
    @default readOnly
  */
  informationMessage: computed('information', function() {
    let information = get(this, 'information') || '';

    return information.message || information;
  }),

  actions: {
    /**
      Обработчик нажатия на кнопку входа в личный кабинет.

      @method actions.onSignInButtonClick
    */
    onSignInButtonClick() {
      let session = this.get('session');
      if (session.get('isSignedIn')) {
        return;
      }

      session.signIn('Иван Иванов', '111');
    },

    /**
      Обработчик нажатия на кнопку выхода из личного кабинет-а.

      @method actions.onSignInButtonClick
    */
    onSignOutButtonClick() {
      let session = this.get('session');
      if (!session.get('isSignedIn')) {
        return;
      }

      session.signOut();
    },

    /**
      Обработчик нажатия на кнопку закрытия информационного сообщения.

      @method actions.onHeaderInformationMessageClose
    */
    onHeaderInformationMessageClose() {
      set(this, 'information', null);
    },

    /**
      Обработчик нажатия на кнопку закрытия сообщения об ошибке.

      @method actions.onHeaderErrorMessageClose
    */
    onHeaderErrorMessageClose() {
      set(this, 'error', null);
    }
  }
});
