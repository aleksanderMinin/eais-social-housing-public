import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import tQueueTypeEnum from '../enums/e-a-i-s-public-application-t-queue-type';

export default FlexberryEnum.extend({
  enum: tQueueTypeEnum,
  sourceType: 'EAIS.PublicApplication.tQueueType'
});
