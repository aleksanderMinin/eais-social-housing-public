import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import tSostoianieEnum from '../enums/e-a-i-s-public-application-t-sostoianie';

export default FlexberryEnum.extend({
  enum: tSostoianieEnum,
  sourceType: 'EAIS.PublicApplication.tSostoianie'
});
