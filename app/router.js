import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  // Страницы с "мастеровой" страницей.
  // Здесь установив path в '/' мы делаем роут 'master-page' страницей по умолчанию вмеcто 'index'.
  this.route('master-page', { path: '/' }, function() {

    // Страница "Новости".
    // Здесь установив path в '/' мы делаем роут 'master-page.news' страницей по умолчанию вместо 'master.index'.
    // Таким образом страница 'master-page.news' становится стартовой страницей всего приложения.
    // Ниже снова зарегистрировав роут news, у которого path установлен в '/news'
    // мы просто позволяем переходить на этот роут как по пути '.../#/', так и по пути '.../#/news'.
    this.route('news', { path: '/' });
    this.route('news', { path: '/news' }, function() {

      // Отдельно взятая новость.
      // Будет доступна по пути '.../#/news/<id>'
      this.route('article', { path: '/:id' });
    });

    // Страница "Статистика".
    this.route('statistics', { path: '/statistics' });

    // Страница "Сервисы".
    this.route('services', { path: '/services' });

    // Страница "Нормативные акты".
    this.route('normative-acts', { path: '/normative-acts' });

    // Страница "Положение в очереди".
    this.route('queue-position', { path: '/queue-position' });

    // Страница "Контакты".
    this.route('contacts', { path: '/contacts' }, function() {
      // Отдельно взятый контакт.
      // Будет доступен по пути '.../#/contacts/<id>'
      this.route('organization', { path: '/:id' });
    });
  });

  // Страницы без "мастеровой" страницы.
  // Страница входа.
  this.route('login');

  // Страница для отображения ошибки 404 ('/*path' даст совпадение для любого URL-а отличающегося от описанных выше).
  this.route('404', { path: '/*path' });
});

export default Router;
