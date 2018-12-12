import OnlineStore from 'ember-flexberry-data/stores/online-store';
import StoreMixin from 'ember-flexberry-data/mixins/store';

/**
  Сервис для работы с данными.
  Представляет методы для получения данных, и создает модели на основе полученных данных.

  @class StoreService
*/
export default OnlineStore.extend(StoreMixin);
