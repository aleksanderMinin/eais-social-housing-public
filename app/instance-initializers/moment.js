/**
  Конфигурирует moment-сервис.

  @for ApplicationInstanceInitializer
  @method moment.initialize
  @param {<a href="https://emberjs.com/api/ember/release/classes/ApplicationInstance">ApplicationInstance</a>} applicationInstance Экземпляр Ember-приложения.
*/
export function initialize(applicationInstance) {
  let moment = applicationInstance.lookup('service:moment');
  // В нескольких форматах даты убираем 'г.' после года.
  moment.updateLocale('ru', {
    longDateFormat : {
      LL : 'D MMMM YYYY',
      LLL : 'D MMMM YYYY, H:mm',
      LLLL : 'dddd, D MMMM YYYY, H:mm'
    }
  });
}

export default {
  initialize
};
