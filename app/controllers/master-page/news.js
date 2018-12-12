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
      Обработчик нажатия на вкладку одного из типов очереди, к которым должны относиться отображаемые новостные статьи.
      Устанавливает выбранный тип очреди активным, и посылает запрос на загрузку порции новостных статей, относящихся к этому типу очереди.

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

      let newsArticles = get(queueTypeData, 'newsArticles');
      let newsArticlesCount = get(newsArticles, 'length');
      let existingNewsArticlesCount = get(queueTypeData, 'existingNewsArticlesCount');
      if ((existingNewsArticlesCount > 0 && newsArticlesCount > 0) || (existingNewsArticlesCount === 0 && newsArticlesCount === 0)) {
        // Начальная порция новостных статей либо уже была загружена, либо статей вообще еще нет.
        // Просто переключаем вкладку, не переходя к загрузке новостных статей.
        return;
      }

      // Загружаем начальную порцию новостных статей.
      this.send('loadNewsArticles', { queueType, queueTypeData });
    },

    /**
      Обработчик нажатия на кнопку "Показать больше".
      Посылает запрос на загрузку следующей порции новостных статей для активного, в данный момент, типа очереди.

      @method actions.onShowMoreButtonClick
      @param {Object} options Опции обработчика.
      @param {String} options.queueType Тип очереди, кнопка которого была нажата.
      @param {Object} options.queueTypeData Данные, соответствующие типу очереди.
    */
    onShowMoreButtonClick({ queueType, queueTypeData }) {
      this.send('loadNewsArticles', { queueType, queueTypeData });
    }
  }
});
