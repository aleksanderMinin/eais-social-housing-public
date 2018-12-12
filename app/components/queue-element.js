import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import tSostoianie from '../enums/e-a-i-s-public-application-t-sostoianie';
import config from '../config/environment';
import $ from 'jquery';

export default Component.extend({

  /**
   * Флаг, развернуть элемент
   *
   * @type {Boolean}
   * @default false
   */
  showElement: false,

  /**
   * Номер элемента в списке
   *
   * @type {Number}
   */
  index: 0,

  /**
   * Модель InfZaiavlenie
   *
   * @type {DS.Model} 'e-a-i-s-public-application-inf-zaiavlenie'
   */
  model: null,

  dateValue: null,

  // Состояние из модели
  sostoianie: computed(function() {
    return tSostoianie[get(this, 'model.sostoianie')];
  }),

  /**
   * Данные по очереди находятся в model.queueInfo
   * если данных нет, они подгружаются
   */
  didInsertElement() {
    const model = get(this, 'model');
    if (model && !get(model, 'queueInfo')) {
      const url = `${config.APP.backendUrls.webapi}/InfZaiavlenie/GetQueueInfo`;
      $.get(url, { pk: get(this, 'model.cliuchZaiavitelia') }, (responseString) => {
        const data = JSON.parse(responseString);
        set(this,  'model.queueInfo', {
          nomer: data.nomer,
          pered: data.pered,
          ranee: data.ranee,
          vidano: data.vidano
        });
      });
    }
  },

  // В очереди
  inQueue: computed(function() {
    return get(this, 'sostoianie') === tSostoianie.V_ocheredi || get(this, 'sostoianie') === tSostoianie.V_predvaritelnom_spiske;
  }),

  // Включен в список
  inList: computed(function() {
    return get(this, 'sostoianie') === tSostoianie.V_spiske_na_vyplatu || get(this, 'sostoianie') === tSostoianie.Vydan_sertifikat;
  }),

  // Реализовал право
  isImplemented: computed(function() {
    return get(this, 'sostoianie') === tSostoianie.Realizovan_sertifikat;
  }),

  // Исключен
  isExcluded: computed(function() {
    return get(this, 'sostoianie') === tSostoianie.Iscliuchen_iz_ocheredi;
  }),

  _toggle(elemName){
    set(this, elemName, !get(this, elemName));
  },

  actions: {

    toggleElement() {
      this._toggle('showElement');
    },

    // TODO не реализовано
    showCalendar() {
      // this._toggle('selectPeriod');
    },

    // TODO не реализовано
    getByPeriod() {
      //
    }
  }
});
