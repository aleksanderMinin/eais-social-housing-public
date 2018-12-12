import Controller from '@ember/controller';
import tQueueType from '../../enums/e-a-i-s-public-application-t-queue-type';
import { computed, get, set } from '@ember/object';
import { inverseEnum } from 'ember-flexberry-data/utils/enum-functions';

export default Controller.extend({

  tQueueTypes: tQueueType,

  invQueueTypes: computed(function() {
    return inverseEnum(tQueueType);
  }),

  /**
    Активная/выбранная программа
   */
  activeItem: tQueueType.WW2Veterans,

  /**
   * Модели выбранной программы
   */
  activeQueue: computed('activeItem', function() {
    return get(this, 'model.' + get(this, 'invQueueTypes')[get(this, 'activeItem')]);
  }),

  actions: {

    // Делает программу активной
    activateItem(item) {
      set(this, 'activeItem', item);
    },
  }
});
