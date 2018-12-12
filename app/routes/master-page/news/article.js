import Route from '@ember/routing/route';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import { get, set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { isNone } from '@ember/utils';
import { MDCDialog } from '@material/dialog';

export default Route.extend({
  /**
    Ссылка на диалоговое окно.

    @property dialog
    @type Object
    @default null
  */
  dialog: null,

  actions: {
    /**
      Обработчик action-а, который выполняется после успешного перехода к роуту.

      @method actions.didTransition
    */
    didTransition() {
      scheduleOnce('afterRender', this, function () {
        // Инициализируем диалоговое окно (см. https://material.io/develop/web/components/dialogs/).
        let dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
        set(this, 'dialog', dialog);

        dialog.listen('MDCDialog:closed', () => {
          this.transitionTo('master-page.news');
        });

        dialog.open();
      });

      return true;
    },

    /**
      Обработчик action-а, который выполняется перед уходом с роута.

      @method actions.willTransition
    */
    willTransition() {
      // Деинициализируем диалоговое окно.
      let dialog = get(this, 'dialog');
      set(this, 'dialog', null);

      if (!isNone(dialog)) {
        dialog.destroy();
      }

      return true;
    }
  },

  /**
    Загружает заданную новостную статью.
    [Больше информации](https://emberjs.com/api/ember/3.5/classes/Route/methods/model?anchor=model).

    @method model
    @param {Object} params Параметры URL.
    @param {Object} transition Объект transition.
    @return {Object} Модель, представляющая заданную новостную статью.
  */
  model(params, transition) {
    let newsArticleId = get(params, 'id');
    let modelName = 'e-a-i-s-public-application-news-article';
    let store = get(this, 'store');
    let queryBuilder = new QueryBuilder(store)
      .from(modelName)
      .selectByProjection('NewsArticleL')
      .byId(newsArticleId);

    return store.query(modelName, queryBuilder.build()).then((newsArticles) => {
      return get(newsArticles, 'firstObject');
    }).catch((error) => {
      let masterPageController = this.controllerFor('master-page');
      set(masterPageController, 'error', new Error('Произошла ошибка при загрузке новостной статьи.'));
      window.console.error('Произошла ошибка при загрузке новостной статьи: ', error);

      this.transitionTo('master-page.news');
    });
  }
});
