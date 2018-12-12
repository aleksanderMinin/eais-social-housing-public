import BaseModel from 'ember-flexberry-data/models/model';
import DS from 'ember-data';
import Projection from 'ember-flexberry-data/utils/attributes';

let Model = BaseModel.extend({
  dataSreza: DS.attr('string'),
  programma: DS.attr('string'),
  period: DS.attr('e-a-i-s-public-application-t-period'),
  infZaiavlenie: DS.hasMany('e-a-i-s-public-application-inf-zaiavlenie', { inverse: 'infOcheredNaDatu', async: false }),
});

Model.defineProjection('InfOcheredNaDatuL', 'e-a-i-s-public-application-inf-ochered-na-datu', {
  dataSreza: Projection.attr(''),
  programma: Projection.attr(''),
  period: Projection.attr('')
});

export default Model;
