import BaseModel from 'ember-flexberry-data/models/model';
import DS from 'ember-data';
import Projection from 'ember-flexberry-data/utils/attributes';

let Model = BaseModel.extend({
  cliuchZaiavleniia: DS.attr('string'),
  cliuchZaiavitelia: DS.attr('string'),
  nomerVOcheredi: DS.attr('number'),
  territoriiaOcheredi: DS.attr('string'),
  dataPostanovkiNaUchyot: DS.attr('date'),
  kategoriia: DS.attr('string'),
  prioritet: DS.attr('number'),
  sostoianie: DS.attr('e-a-i-s-public-application-t-sostoianie'),
  dataSostoianiia: DS.attr('date'),
  prichinaIscliucheniia: DS.attr('string'),
  parametryJSON: DS.attr('string'),
  godNastupleniiaPrava: DS.attr('number'),
  dataAkta: DS.attr('date'),
  infOcheredNaDatu: DS.belongsTo('e-a-i-s-public-application-inf-ochered-na-datu', { inverse: 'infZaiavlenie', async: false }),
});

Model.defineProjection('InfZaiavlenieL', 'e-a-i-s-public-application-inf-zaiavlenie', {
  cliuchZaiavleniia: Projection.attr(''),
  cliuchZaiavitelia: Projection.attr(''),
  nomerVOcheredi: Projection.attr(''),
  territoriiaOcheredi: Projection.attr(''),
  dataPostanovkiNaUchyot: Projection.attr(''),
  kategoriia: Projection.attr(''),
  prioritet: Projection.attr(''),
  sostoianie: Projection.attr(''),
  dataSostoianiia: Projection.attr(''),
  prichinaIscliucheniia: Projection.attr(''),
  parametryJSON: Projection.attr(''),
  godNastupleniiaPrava: Projection.attr(''),
  dataAkta: Projection.attr(''),
  infOcheredNaDatu: Projection.belongsTo('e-a-i-s-public-application-inf-ochered-na-datu', '', {
    dataSreza: Projection.attr(''),
    programma: Projection.attr(''),
    period: Projection.attr('')
  }, { hidden: true })
});

export default Model;
