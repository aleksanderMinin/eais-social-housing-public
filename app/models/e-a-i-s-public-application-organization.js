import BaseModel from 'ember-flexberry-data/models/model';
import DS from 'ember-data';
import Projection from 'ember-flexberry-data/utils/attributes';

let Model = BaseModel.extend({
  name: DS.attr('string')
});

Model.defineProjection('OrganizationL', 'e-a-i-s-public-application-organization', {
  name: Projection.attr('Наименование')
});

export default Model;
