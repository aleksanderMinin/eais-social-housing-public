import Route from '@ember/routing/route';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import $ from 'jquery';
import { get, set } from '@ember/object';
import { isBlank, typeOf } from '@ember/utils';
import { A } from '@ember/array';

import queueTypes from '../../enums/e-a-i-s-public-application-t-queue-type';
const queueTypeAll = 'All';
const queueTypeNone = 'None';

const newsArticlesInFirstPortionCount = 8;
const newsArticlesInOnePortionCount = 9;

export default Route.extend({
  actions: {
    /**
      Обработчик, загружающий следующую порцию новостных статей.

      @method actions.loadNewsArticles
      @param {Object} options Опции метода.
      @param {String} options.queueType Тип очереди, к которому должны относиться загружаемые статьи.
      @param {Object} options.queueTypeData Данные, соответствующие типу очереди.
    */
    loadNewsArticles(options) {
      this.loadNewsArticles(options);
    }
  },

  /**
    Загружает список новстей.
    [Больше информации](https://emberjs.com/api/ember/3.5/classes/Route/methods/model?anchor=model).

    @method model
    @param {Object} params Параметры URL.
    @param {Object} transition Объект transition.
    @return {Object} Модель, представляющая список новостей.
  */
  model(params, transition) {
    // Подготавливаем модель.
    // Объект, ключи которого это доступные типы очереди, к которым должны относиться отображаемые новостные статьи,
    // а значения - объекты, содержащие загруженные для сответствующих типов новостные статьи, и дополнительные данные о них.
    let availableQueueTypes = {};
    set(availableQueueTypes, queueTypeAll, 'Все');
    $.extend(true, availableQueueTypes, queueTypes);
    delete availableQueueTypes[queueTypeNone];

    for (let [queueType, caption] of Object.entries(availableQueueTypes)) {
      set(availableQueueTypes, queueType, {
        caption: caption,
        isLoading: false,
        skipOffset: 0,
        newsArticles: A(),
        existingNewsArticlesCount: null
      });
    }

    // Загружаем первые 5 новостных статей для типа очереди "Все", т.е. без фильтрации по типу очереди.
    // Остальные будут подгружаться по требованию.
    let queueTypeData = get(availableQueueTypes, queueTypeAll);
    this.loadNewsArticles({ queueTypeAll, queueTypeData });

    return availableQueueTypes;
  },

  /**
    Устанавливает контроллер для текущего роута.
    [Больше информации](https://emberjs.com/api/ember/3.5/classes/Route/methods/setupController?anchor=setupController).

    @method setupController
    @param {Ember.Controller} controller Контроллер формы соответствующей роуту.
    @param {Object} model Модель соответствующая роуту.
    @param {Object} transition Объект transition.
  */
  setupController(controller, model, transition) {
    this._super(...arguments);

    // Активный, на данный момент, тип очереди.
    set(controller, 'activeQueueType', queueTypeAll);
  },

  /**
    Загружает порцию новостных статей.

    @method actions.loadNewsArticles
    @param {Object} options Опции метода.
    @param {String} options.queueType Тип очереди, к которому должны относиться загружаемые статьи.
    @param {Object} options.queueTypeData Данные, соответствующие типу очереди.
    @return {<a href="https://emberjs.com/api/ember/3.5/classes/RSVP.Promise">Promise</a>} Промис, возвращающий загруженную порцию новостных статей.
  */
  loadNewsArticles(options) {
    options = options || {};
    let queueType = get(options, 'queueType');
    let queueTypeData = get(options, 'queueTypeData');

    let newsArticles = get(queueTypeData, 'newsArticles');
    let skip = get(newsArticles, 'length') + get(queueTypeData, 'skipOffset');
    let top = get(newsArticles, 'length') === 0 ? newsArticlesInFirstPortionCount : newsArticlesInOnePortionCount;

    let modelName = 'e-a-i-s-public-application-news-article';
    let store = get(this, 'store');
    let queryBuilder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection('NewsArticleL')
      .orderBy('publicationDate desc')
      .skip(skip)
      .top(top)
      .count();

    if (!isBlank(queueType) && queueType !== queueTypeAll) {
      queryBuilder.where('queueType', FilterOperator.Eq, queueType);
    }

    set(queueTypeData, 'isLoading', true);
    return store.query(modelName, queryBuilder.build()).then((loadedNewsArticles) => {
      let peviousExistingNewsArticlesCount = get(queueTypeData, 'existingNewsArticlesCount');
      let existingNewsArticlesCount = get(loadedNewsArticles, 'meta.count');
      set(queueTypeData, 'existingNewsArticlesCount', existingNewsArticlesCount);

      let newNewsArticlesHasBeenAdded = typeOf(peviousExistingNewsArticlesCount) === 'number' &&
        typeOf(existingNewsArticlesCount) === 'number' &&
        peviousExistingNewsArticlesCount >= 0 &&
        peviousExistingNewsArticlesCount < existingNewsArticlesCount;
      if (newNewsArticlesHasBeenAdded) {
        // Пока пользователь просматривал страницу новостей, в систему были добавлены новые новостные статьи.
        // Это нужно учитывать при дальнейшей загрузке новостных стетей, а также сообщить об этом пользователю.
        let masterPageController = this.controllerFor('master-page');
        set(masterPageController, 'information', 'Опубликованы новые новости. Перезагрузите страницу новостей, чтобы их увидеть.');

        let skipOffset = existingNewsArticlesCount - peviousExistingNewsArticlesCount;
        set(queueTypeData, 'skipOffset', skipOffset);

        // Повторяем загрузку новостей, но уже с учетом поправки на новые статьи.
        return this.loadNewsArticles(options);
      }

      let loadedNewsArticlesArray = loadedNewsArticles.toArray();
      newsArticles.pushObjects(loadedNewsArticlesArray);

      return loadedNewsArticlesArray;
    }).catch((error) => {
      let masterPageController = this.controllerFor('master-page');
      set(masterPageController, 'error', new Error('Произошла ошибка при загрузке новостей.'));
      window.console.error('Произошла ошибка при загрузке новостей: ', error);
    }).finally(() => {
      set(queueTypeData, 'isLoading', false);
    });
  }
});
