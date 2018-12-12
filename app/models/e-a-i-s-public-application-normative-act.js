import BaseModel from 'ember-flexberry-data/models/model';
import DS from 'ember-data';
import Projection from 'ember-flexberry-data/utils/attributes';
import { get, computed } from '@ember/object';
import { typeOf } from '@ember/utils';

let Model = BaseModel.extend({
  publicationDate: DS.attr('date'),
  caption: DS.attr('string'),
  file: DS.attr('file'),
  image: DS.attr('file'),
  imageSrc: DS.attr('string'),
  queueType: DS.attr('e-a-i-s-public-application-t-queue-type', { defaultValue: 'Пусто' }),
  queueSubtype: DS.attr('string'),

  /**
    Метаописание файла нормативного акта в формате JSON.

    @property fileJson
  */
  fileJson: computed('file', function() {
    // Преобразуем сериализованное метаописание файла изображения в JSON-объект.
    let fileJson = null;

    let file = get(this, 'file');
    if (typeOf(file) === 'string') {
      try {
        fileJson = JSON.parse(file);
      } catch (parseError) {
        fileJson = null;
      }
    }

    return fileJson;
  }),

  /**
    Метаописание файла изображения в формате JSON.

    @property imageJson
  */
  imageJson: computed('image', function() {
    // Преобразуем сериализованное метаописание файла изображения в JSON-объект.
    let imageJson = null;

    let image = get(this, 'image');
    if (typeOf(image) === 'string') {
      try {
        imageJson = JSON.parse(image);
      } catch (parseError) {
        imageJson = null;
      }
    }

    return imageJson;
  })
});

Model.defineProjection('NormativeActL', 'e-a-i-s-public-application-normative-act', {
  publicationDate: Projection.attr('Дата публикации'),
  caption: Projection.attr('Заголовок'),
  file: Projection.attr('Файл нормативного акта'),
  image: Projection.attr('Файл изображения'),
  imageSrc: Projection.attr('Файл изображения в виде DataURL'),
  queueType: Projection.attr('Тип очереди'),
  queueSubtype: Projection.attr('Подтип очереди')
});

export default Model;
