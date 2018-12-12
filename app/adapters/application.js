import OdataAdapter from 'ember-flexberry-data/adapters/odata';
import AdapterMixin from 'ember-flexberry-data/mixins/adapter';
import config from '../config/environment';

/**
  OData-адаптер преобразующий запросы на получение данных, в OData-запросы, и осуществляющий их.

  @calss ApplicationAdapter
*/
export default OdataAdapter.extend(AdapterMixin, {
  host: config.APP.backendUrls.odata,

  ajax(url, type, options) {
    options.xhrFields = { withCredentials: true };

    return this._super(url, type, options);
  }
});
