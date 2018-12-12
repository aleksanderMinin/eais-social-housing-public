import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import tPeriodEnum from '../enums/e-a-i-s-public-application-t-period';

export default FlexberryEnum.extend({
  enum: tPeriodEnum,
  sourceType: 'EAIS.PublicApplication.tPeriod'
});
