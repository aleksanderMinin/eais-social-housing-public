import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { A, isArray } from '@ember/array';
import { on } from '@ember/object/evented';

/**
  Добавляет роутам приложения логику, которая позволяет отслеживать какие роуты сейчас активны.
  Вообще для этого есть стоковый метод [`isActive`](https://emberjs.com/api/ember/3.5/classes/RouterService/methods/isActive?anchor=isActive), но он почему-то периодически кидает исключения и эта проблема в ember-е еще не исправлена,
  поэтому пишем для этих целей собственную логику.

  @for ApplicationInitializer
  @method isActive.initialize
  @param {<a href="https://emberjs.com/api/ember/3.5/classes/Application">Application</a>} application Ember-приложение.
*/
export function initialize(application) {
  Route.reopen({
    /**
      Ссылка на `router`-сервис.

      @property router
      @type <a href="https://emberjs.com/api/ember/3.5/classes/RouterService">RouterService</a>
    */
    router: service(),

    /**
      Обработчик активации роута.

      @method _pushToActiveRoutesList
      @private
    */
    _pushToActiveRoutesList: on('activate', function() {
      let router = get(this, 'router');
      let activeRoutesList = get(router, '_activeRoutesList');
      if (!isArray(activeRoutesList)) {
        activeRoutesList = A();
        set(router, '_activeRoutesList', activeRoutesList);
      }

      let routeName = get(this, 'routeName');
      activeRoutesList.pushObject(routeName);
    }),

    /**
      Обработчик деактивации роута.

      @method _addToActiveRoutesList
      @private
    */
    _removeFromActiveRoutesList: on('deactivate', function() {
      let router = get(this, 'router');
      let activeRoutesList = get(router, '_activeRoutesList');
      if (!isArray(activeRoutesList)) {
        return;
      }

      let routeName = get(this, 'routeName');
      activeRoutesList.removeObject(routeName);
    })
  });
}

export default {
  name: 'is-active',
  initialize
};
