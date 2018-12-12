import Component from '@ember/component';
import { get, observer } from '@ember/object';
import { typeOf } from '@ember/utils';

/**
  Карточка, для отображения каких либо сообщений пользователю.

  @class MessageCardComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
*/
export default Component.extend({
  /**
    Массив CSS-классов для <div>-блока являющегося оберткой компонента.
    Любой дополнительный CSS-класс может быть добавлен через свойство 'class' компонента.

    @example
      ```handlebars
      {{message-card
        class="my-css-class"
      }}
      ```
    @property classNames
    @type String[]
    @default ['message-card']
  */
  classNames: ['message-card'],

  /**
    Флаг: видима-ли карточка в данный момент.

    @property visible
    @type Boolean
    @default false
  */
  visible: false,

  actions: {
    /**
      Обработчик нажатия на кнопку закрытия карточки.

      @method actions.onCloseButtonClick
    */
    onCloseButtonClick() {
      // Вызываем обработчик action-а 'close'.
      if (typeOf(this.close) === 'function') {
        this.close();
      }

      // Плавно скрываем карточку.
      this.$().fadeOut();
    }
  },

  /**
    Обработчик изменения флага видимости карточки.

    @method _visibleDidChange
    @private
  */
  _visibleDidChange: observer('visible', function() {
    if (get(this, 'visible')) {
      this.$().fadeIn();
    } else {
      this.$().fadeOut();
    }
  })
});
