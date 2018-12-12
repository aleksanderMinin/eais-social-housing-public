import Controller from '@ember/controller';
import tQueueType from '../../enums/e-a-i-s-public-application-t-queue-type';
import QueueCaptions from '../../enums/e-a-i-s-public-application-t-queue-type-case-captions';
import { get, set, computed } from '@ember/object';
import $ from 'jquery';
import { inverseEnum } from 'ember-flexberry-data/utils/enum-functions';
import chartWW2VeteranHousingOptions from '../../chart-options/chartWW2VeteransHousing';
import chartWW2VeteransMoneyOptions from '../../chart-options/chartWW2VeteransMoney';

export default Controller.extend({

  queueCaptions: QueueCaptions,

  chartWW2VeteransHousingOptions: chartWW2VeteranHousingOptions,

  chartWW2VeteransHousingData: null,

  chartWW2VeteransMoneyOptions: chartWW2VeteransMoneyOptions,

  chartWW2VeteransMoneyData: null,

  /**
   * Программы без пустого эелемента
   */
  queueTypes: computed(function() {
    let types = $.extend({}, tQueueType);
    delete types.None;
    return types;
  }),

  /**
    Выбранный тип очереди, к которому должны относиться отображаемые статьи (один из ключей объекта availableQueueTypes).

    @property activeQueueType
    @type String
    @default null
  */
 activeQueueType: inverseEnum(tQueueType)[tQueueType.WW2Veterans],

 /**
  * Выбранный по умолчанию год
  */
 selectedYear: new Date().getFullYear(),

 /**
  * Возможные лета в дропдауне
  */
 years: computed(function() {
  // TODO запрос летов в коих имеются срезы
  return [get(this, 'selectedYear')];
 }),

 actions: {

   onQueueTypeNavigationTabClick(queueType) {
    let activeQueueType = get(this, 'activeQueueType');
    if (queueType === activeQueueType) {
      return;
    }

    set(this, 'activeQueueType', queueType);
  },

  changeYear(yearIndex) {
    set(this, 'selectedYear', get(this, 'years')[yearIndex]);
  },
 }

});
