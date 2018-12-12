import Route from '@ember/routing/route';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { get, set } from '@ember/object';
import { isArray } from '@ember/array';
import { isBlank, isNone } from '@ember/utils';

export default Route.extend({
  actions: {
    /**
      Обработчик action-а, сообщащего, что активной выбрана другая организация.

      @method actions.activeOrganizationDidChange
      @param {Object} options Опции метода.
      @param {String} options.organizationId Идентификатор организации.
    */
    activeOrganizationDidChange({ organizationId }) {
      let controller = get(this, 'controller');
      if (isNone(controller)) {
        return;
      }

      let loadedOrganizations = get(controller, 'model');
      if (isNone(loadedOrganizations)) {
        return;
      }

      let activeOrganization = loadedOrganizations.find((organization) => {
        return get(organization, 'id') === organizationId;
      });
      if (isNone(activeOrganization)) {
        return;
      }

      set(controller, 'activeOrganization', activeOrganization);
    }
  },

  /**
    Загружает список действующих районных отделений.
    [Больше информации](https://emberjs.com/api/ember/3.5/classes/Route/methods/model?anchor=model).

    @method model
    @param {Object} params Параметры URL.
    @param {Object} transition Объект transition.
    @return {Object} Модель, представляющая список новостей.
  */
  model(params, transition) {
    let modelName = 'e-a-i-s-public-application-organization';
    let store = get(this, 'store');
    let queryBuilder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection('OrganizationL')
      .orderBy('name asc');

    return store.query(modelName, queryBuilder.build()).then((loadedOrganizations) => {
      let loadedOrganizationsArray = loadedOrganizations.toArray();

      // Перемещаем министерства в начало массива, чтобы отобразить их в начале списка.
      let ministryOrganizations = loadedOrganizationsArray.filter((organization) => {
        let organizationName = get(organization, 'name') || '';
        return organizationName.search(/министерство/gi) >= 0;
      });
      loadedOrganizationsArray.removeObjects(ministryOrganizations);
      loadedOrganizationsArray.unshiftObjects(ministryOrganizations);

      return loadedOrganizationsArray;
    }).catch((error) => {
      let masterPageController = this.controllerFor('master-page');
      set(masterPageController, 'error', new Error('Произошла ошибка при загрузке контактной информации.'));
      window.console.error('Произошла ошибка при загрузке контактной информации: ', error);
    });
  },

  /**
    Выполняется после загрузки списка действующих районных отделений и перенаправляет на вложенный роут первого из них.
    [Больше информации](https://emberjs.com/api/ember/3.5/classes/Route/methods/redirect?anchor=redirect).

    @method redirect
    @param {Object} loadedOrganizations Список действующих районных отделений.
    @param {Object} transition Объект transition.
  */
  redirect(loadedOrganizations, transition) {
    this._super(...arguments);

    let targetRouteName = get(transition, 'targetName');
    let currentRouteName = `${get(this, 'routeName')}.index`;
    if (currentRouteName !== targetRouteName) {
      return;
    }

    if (!isArray(loadedOrganizations) || get(loadedOrganizations, 'length') === 0) {
      return;
    }

    let firstLoadedOrganization = get(loadedOrganizations, 'firstObject');
    let firstLoadedOrganizationId = get(firstLoadedOrganization, 'id');
    if (isBlank(firstLoadedOrganizationId)) {
      return;
    }

    // Перенаправляем на вложенный роут первого районного отделения из загруженных.
    this.transitionTo('master-page.contacts.organization', firstLoadedOrganizationId);
  }
});
