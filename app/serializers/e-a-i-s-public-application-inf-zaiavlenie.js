import ApplicationSerializer from './application';
import $ from 'jquery';

export default ApplicationSerializer.extend({
  primaryKey: '__PrimaryKey',

  getAttrs: function () {
    let parentAttrs = this._super(...arguments);
    let attrs = {
      infOcheredNaDatu: { serialize: 'odata-id', deserialize: 'records' }
    };

    return $.extend(true, {}, parentAttrs, attrs);
  },

  init: function () {
    this.set('attrs', this.getAttrs());

    this._super(...arguments);
  }
});
