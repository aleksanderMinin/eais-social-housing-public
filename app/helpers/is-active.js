import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { get, observer } from '@ember/object';
import { isArray } from '@ember/array';
import { isNone } from '@ember/utils';

/**
  Проверяет активен ли сейчас роут с заданным именем.

  @class IsActiveHelper
  @extends <a href="https://emberjs.com/api/ember/3.5/classes/Helper">Helper</a>
*/
export default Helper.extend({
  /**
    Ссылка на `router`-сервис.

    @property router
    @type <a href="https://emberjs.com/api/ember/3.5/classes/RouterService">Router</a>
  */
  router: service(),

  /**
    Переопределенный метод [`compute`](https://emberjs.com/api/ember/3.5/classes/Helper/methods/compute?anchor=compute).
    Вычисляет значение хэлпер-а: флаг, показывающий активен ли сейчас роут с заданным именем.

    @method compute
    @param {Array} array Массив параметров, переданных хелперу, где первый параметр это имя роута,
    для которого требуется определить активен он или нет (```{{is-active 'route-name' param2 ...}}```).
    @param {Object} hash Объект содержащий именованные параметры, переданные хэлперу (```{{is-active param1=... param2=...}}```).
    @return {Boolen} Флаг: активен ли сейчас роут с заданным именем.
  */
  compute([routeName, model], hash) {
    let router = get(this, 'router');
    let activeRoutesList = get(router, '_activeRoutesList');
    if (!isArray(activeRoutesList)) {
      return false;
    }

    if (!activeRoutesList.includes(routeName)) {
      return false;
    }

    if (isNone(model)) {
      return true;
    }

    let routesParams = get(router, `_router._routerMicrolib.state.params`) || {};
    let activeRouteParams = get(routesParams, routeName) || {};
    let activeModelId = get(activeRouteParams, 'id');
    let modelId = get(model, 'id') || model;

    return activeModelId === modelId;
  },

  /**
    Обработчик, который отслеживает изменения в списке активных роутов приложения, и при необходимост заставляет хэлпер перевичислить свое значение.

    @method activeRoutesListDidChange
  */
  activeRoutesListDidChange: observer('router._activeRoutesList.[]', 'router.currentURL', function() {
    this.recompute();
  })
});
