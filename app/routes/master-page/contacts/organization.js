import Route from '@ember/routing/route';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { get, set } from '@ember/object';

export default Route.extend({
  /**
    Идентификатор организации, коттакты которой должны быть загружены и отображены.

    @property organizationId
    @type String
  */
  organizationId: null,

  actions: {
    /**
      Обработчик события, сообщающего о том, что переход к роуту успешно завершен.

      @method actions.didTransition
    */
    didTransition() {
      // Сообщаем в родительский роут о том, что активной выбрана другая организация.
      this.send('activeOrganizationDidChange', {
        organizationId: get(this, 'organizationId')
      });

      return true;
    }
  },

  /**
    Загружает контакты заданного районного отделения.
    [Больше информации](https://emberjs.com/api/ember/3.5/classes/Route/methods/model?anchor=model).

    @method model
    @param {Object} params Параметры URL.
    @param {Object} transition Объект transition.
    @return {Object} Модель, представляющая контакты заданого районного отделения.
  */
  model(params, transition) {
    let organizationId = get(params, 'id');
    set(this, 'organizationId', organizationId);

    let modelName = 'e-a-i-s-public-application-specialist';
    let store = get(this, 'store');
    let queryBuilder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection('SpecialistL')
      .where('organization', FilterOperator.Eq, organizationId);

    return store.query(modelName, queryBuilder.build()).then((organizationSpecialists) => {
      // Берем только тех специалистов, у которых заданы ФИО и какая-то контактная информация.
      return organizationSpecialists.toArray().filter((organizationSpecialist) => {
        return get(organizationSpecialist, 'hasFullName') && get(organizationSpecialist, 'hasContactInformation');
      });
    }).catch((error) => {
      let masterPageController = this.controllerFor('master-page');
      set(masterPageController, 'error', new Error('Произошла ошибка при загрузке контактной информации.'));
      window.console.error('Произошла ошибка при загрузке контактной информации: ', error);
    });
  }
});
