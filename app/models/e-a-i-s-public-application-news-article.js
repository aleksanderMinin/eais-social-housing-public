import BaseModel from 'ember-flexberry-data/models/model';
import DS from 'ember-data';
import Projection from 'ember-flexberry-data/utils/attributes';
import { get, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { typeOf } from '@ember/utils';
import $ from 'jquery';

let Model = BaseModel.extend({
  publicationDate: DS.attr('date'),
  caption: DS.attr('string'),
  content: DS.attr('string'),
  image: DS.attr('file'),
  imageSrc: DS.attr('string'),
  queueType: DS.attr('e-a-i-s-public-application-t-queue-type', { defaultValue: 'Пусто' }),

  /**
    Исправленный заголовок новости, из которого удалены возможные спецсимволы.

    @property fixedCaption
  */
  fixedCaption: computed('caption', function() {
    // Вычищаем спецсимволы из заголовка.
    let newsArticleCaption = get(this, 'caption');
    let fixedNewsArticleCaption = newsArticleCaption
      .replace(/\\r/gi, '')
      .replace(/\\n/gi, '')
      .replace(/\\t/gi, '');

    return fixedNewsArticleCaption;
  }),

  /**
    Исправленное содержание новости, из которого удалены возможные спецсимволы,
    лишние элементы разметки, и выполнено преобразование в htmlSafe.

    @property fixedContent
  */
  fixedContent: computed('content', function() {
    // Т.к. содержание новостной статьи может включать HTML-разметку, необходимо обернуть его в htmlSafe,
    // иначе HTML-разметка будет отображаться как текст.
    // Так же нужно предварительно вычистить из разметки спецсимволы и лишные атрибуты,
    // например inline-стили, или ширину и высоту изображений, иначе не будут учтены стили заданные в приложении.
    let newsArticleContent = get(this, 'content');
    let $newsArticleContent = $(`<div>${newsArticleContent}</div>`);
    $newsArticleContent.children().removeAttr('style');
    $('img', $newsArticleContent)
      .removeAttr('width')
      .removeAttr('height')
      .attr('alt', 'Нет изображения')
      .addClass('news-article-dialog__image');
    $('a', $newsArticleContent).addClass('link');

    let fixedNewsArticleContent = $newsArticleContent[0].innerHTML
      .replace(/\\r/gi, '')
      .replace(/\\n/gi, '')
      .replace(/\\t/gi, '');

    return htmlSafe(fixedNewsArticleContent);
  }),

  /**
    Исправленный заголовок новости, из которого удалены возможные спецсимволы.

    @property fixedImage
  */
  fixedImage: computed('image', function() {
    // Преобразуем сериализованное метаописание файла изображения в JSON-объект.
    let fixedImage = null;

    let image = get(this, 'image');
    if (typeOf(image) === 'string') {
      try {
        fixedImage = JSON.parse(image);
      } catch (parseError) {
        fixedImage = null;
      }
    }

    return fixedImage;
  })
});

Model.defineProjection('NewsArticleL', 'e-a-i-s-public-application-news-article', {
  publicationDate: Projection.attr('Дата публикации'),
  caption: Projection.attr('Тема'),
  content: Projection.attr('Содержание'),
  image: Projection.attr('Заглавное изображение'),
  imageSrc: Projection.attr('DataURL заглавного изображения'),
  queueType: Projection.attr('Тип очереди')
});

export default Model;
