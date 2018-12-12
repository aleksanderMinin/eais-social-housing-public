import Component from '@ember/component';
import {MDCMenu} from '@material/menu';
import { get, set } from '@ember/object';

export default Component.extend({

  /**
   * Экземпляр меню
   */
  menu: null,

  /**
   * Класс для основной кнопки
   */
  buttonClass: null,

  /**
   * Элементы для дропдауна
   */
  items: null,

  didRender() {
    this._super();

    const menu = new MDCMenu(document.querySelector('.mdc-menu'));
    set(this, 'menu', menu);
    menu.listen('MDCMenu:selected', (data) => {
      this.send('selectedIntemIndex', get(data, 'detail.index'));
    });
  },

  actions: {
    open() {
      get(this, 'menu').open = true;
    }
  }
});
