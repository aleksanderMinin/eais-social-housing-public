import Controller from '@ember/controller';
import { get, set } from '@ember/object';

export default Controller.extend({
  /**
    Выбранный тип очереди, к которому должны относиться отображаемые статьи (один из ключей объекта availableQueueTypes).

    @property activeQueueType
    @type String
    @default null
  */
  activeQueueType: null,

  actions: {
    /**
      Обработчик нажатия на вкладку одного из типов очереди, к которым должны относиться отображаемые нормативные акты.
      Устанавливает выбранный тип очреди активным.

      @method actions.onQueueTypeNavigationTabClick
      @param {Object} options Опции обработчика.
      @param {String} options.queueType Тип очереди, вкладка которого была нажата.
      @param {Object} options.queueTypeData Данные, соответствующие типу очереди.
    */
    onQueueTypeNavigationTabClick({ queueType, queueTypeData }) {
      let activeQueueType = get(this, 'activeQueueType');
      if (queueType === activeQueueType) {
        return;
      }

      set(this, 'activeQueueType', queueType);
    }
  }
});
