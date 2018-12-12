import Component from '@ember/component';
import { get, set } from '@ember/object';
import $ from 'jquery';

/**
  Специализированная кнопка для прокрутки страницы наверх.

  @class ScrollUpButtonComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
*/
export default Component.extend({
  /**
    Массив CSS-классов для <div>-блока являющегося оберткой компонента.
    Любой дополнительный CSS-класс может быть добавлен через свойство 'class' компонента.

    @example
      ```handlebars
      {{scroll-up-button
        class="my-css-class"
      }}
      ```
    @property classNames
    @type String[]
    @default ['scroll-up-button']
  */
  classNames: ['scroll-up-button'],

  actions: {
    /**
      Обработчик события 'scroll' окна приложения.

      @method actions.onWindowScroll
    */
    onWindowScroll() {
      if ($(window).scrollTop() > 100) {
        this.$().fadeIn();
      } else {
        this.$().fadeOut();
      }
    }
  },

  /**
    Инициализирует свойства компонента, связанные с разметкой в DOM.
  */
  didInsertElement() {
    this._super(...arguments);

    let onWindowScroll = get(this, 'actions.onWindowScroll').bind(this);
    set(this, 'actions.onWindowScroll', onWindowScroll);

    $(window).on('scroll', onWindowScroll);
  },

  /**
    Деинициализирует свойства компонента, связанные с разметкой в DOM.
  */
  willDestroyElement() {
    let onWindowScroll = get(this, 'actions.onWindowScroll').bind(this);
    $(window).off('scroll', onWindowScroll);

    this._super(...arguments);
  },

  /**
    Обработчик клика по кнопке.

    @method click
  */
  click() {
    $('html, body').animate({ scrollTop: 0 }, 600);
  }
});
