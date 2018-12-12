import Route from '@ember/routing/route';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import $ from 'jquery';
import { get, set } from '@ember/object';
import { isBlank, isNone } from '@ember/utils';
import { A } from '@ember/array';

import queueTypes from '../../enums/e-a-i-s-public-application-t-queue-type';
const queueTypeNone = 'None';
const queueTypeWW2Veterans = 'WW2Veterans';

export default Route.extend({
  /**
    Загружает список нормативных актов.
    [Больше информации](https://emberjs.com/api/ember/3.5/classes/Route/methods/model?anchor=model).

    @method model
    @param {Object} params Параметры URL.
    @param {Object} transition Объект transition.
    @return {Object} Модель, представляющая список нормативных актов.
  */
  model(params, transition) {
    // Подготавливаем модель.
    // Объект, ключи которого это доступные типы очереди, к которым должны относиться отображаемые нормативные акты,
    // а значения - объекты, содержащие загруженные для сответствующих типов нормативные акты, и дополнительные данные о них.
    let invertedQueueTypes = {};
    let availableQueueTypes = {};
    $.extend(true, availableQueueTypes, queueTypes);
    delete availableQueueTypes[queueTypeNone];

    for (let [queueType, caption] of Object.entries(availableQueueTypes)) {
      set(availableQueueTypes, queueType, {
        caption: caption,
        normativeActs: A(),
        queueSubtypes: {}
      });

      invertedQueueTypes[caption] = queueType;
    }

    return this.loadNormativeActs().then((normativeActs) => {
      normativeActs.forEach((normativeAct) => {
        let queueType = get(invertedQueueTypes, get(normativeAct, 'queueType'));
        let queueTypeData = get(availableQueueTypes, queueType);
        if (isNone(queueTypeData)) {
          return;
        }

        let queueSubtype = get(normativeAct, 'queueSubtype');
        if (isBlank(queueSubtype)) {
          get(queueTypeData, 'normativeActs').pushObject(normativeAct);
        } else {
          let queueSubtypes = get(queueTypeData, `queueSubtypes`);
          let queueSubtypeData = get(queueSubtypes, queueSubtype);
          if (isNone(queueSubtypeData)) {
            queueSubtypeData = {
              caption: queueSubtype,
              normativeActs: A(),
            };

            queueSubtypes[queueSubtype] = queueSubtypeData;
          }

          get(queueSubtypeData, 'normativeActs').pushObject(normativeAct);
        }
      });

      return availableQueueTypes;
    });
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
    set(controller, 'activeQueueType', queueTypeWW2Veterans);
  },

  /**
    Загружает нормативные акты.

    @method actions.loadNormativeActs
    @return {<a href="https://emberjs.com/api/ember/3.5/classes/RSVP.Promise">Promise</a>} Промис, возвращающий загруженную порцию новостных статей.
  */
  loadNormativeActs() {
    let modelName = 'e-a-i-s-public-application-normative-act';
    let store = get(this, 'store');
    let queryBuilder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection('NormativeActL')
      .orderBy('queueSubtype asc, publicationDate desc');

    return store.query(modelName, queryBuilder.build()).then((loadedNormativeActs) => {
      return loadedNormativeActs.toArray();
    }).catch((error) => {
      let masterPageController = this.controllerFor('master-page');
      set(masterPageController, 'error', new Error('Произошла ошибка при загрузке нормативных актов.'));
      window.console.error('Произошла ошибка при загрузке нормативных актов: ', error);
    });
  }
});
