import Route from '@ember/routing/route';
import { get, observer, set } from '@ember/object';
import { inject as service } from '@ember/service';
import tQueueType from '../../enums/e-a-i-s-public-application-t-queue-type';
import config from '../../config/environment';
import $ from 'jquery';

export default Route.extend({

  session: service(),

  /**
   * Начало периода
   *
   * @type {Date}
   */
  periodStartDate: null,

  /**
   * Конец периода
   *
   * @type {Date}
   */
  periodEndDate: null,

  userPkLichnostObserver: observer('session.userPkLichnost', function() {
    const pk = get(this, 'session.userPkLichnost');
    if (pk) {
      this._loadInfZaiavlenie(pk).then(data => {
        set(this, 'controller.model', data);
        set(this, 'controller.activeItem', tQueueType.WW2Veterans);
      })
    } else {
      set(this, 'controller.activeItem', null);
      set(this, 'controller.model', null);
    }
  }),

  /**
   * Загрузка информации по заявлениям
   */
  _loadInfZaiavlenie() {
    const url = `${config.APP.backendUrls.webapi}/InfZaiavlenie/GetInfZaiavlenie`;
    const data = {
      pkLichnosti: get(this, 'session.userPkLichnost'),
      startDate: get(this, 'session.periodStartDate'),
      endDate: get(this, 'session.periodEndDate')
    };

    return $.post(url, data).then((stringData) => {
      var data = JSON.parse(stringData);
      return {
        WW2Veterans: data.filter(model => get(model, 'infOcheredNaDatu.programma') === tQueueType.WW2Veterans),
        VeteransAndHandicapped: data.filter(model => get(model, 'infOcheredNaDatu.programma') === tQueueType.VeteransAndHandicapped),
        OrphanedChildren: data.filter(model => get(model, 'infOcheredNaDatu.programma') === tQueueType.OrphanedChildren),
        YoungFamilies: data.filter(model => get(model, 'infOcheredNaDatu.programma') === tQueueType.YoungFamilies),
        Rehabilitated: data.filter(model => get(model, 'infOcheredNaDatu.programma') === tQueueType.Rehabilitated)
      };
    });
  },

  model() {
    return this._loadInfZaiavlenie();
  },

  actions: {

    /**
      TODO
      Информация по выбранному периоду

     * @param {Date} startDate
     * @param {Date} endDate
     */
    setPeriod(startDate, endDate) {
      //
    }
  }
});
