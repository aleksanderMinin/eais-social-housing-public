import Controller from '@ember/controller';
import { get } from '@ember/object';
import { isBlank, isNone } from '@ember/utils';

export default Controller.extend({
  /**
    Ссылка на активную, в данный момент, организацию, котакты которой должны быть и отображены.

    @property activeOrganization
    @type Object
  */
  activeOrganization: null,

  actions: {
    /**
      Обработчик нажатия на кнопку при фокусе на поле ввода, предназначенном для поиска.

      @method actions.onSearchTextFieldKeyUp
      @param {Object} e Прокси-объект сработавшего события.
    */
    onSearchTextFieldKeyUp(e) {
      let keyCode = get(e, 'which');
      if (keyCode !== 13) {
        return;
      }

      // Была нажата клавиша enter, нужно осуществить поиск.
      let searchFilter = get(e, 'target.value');
      if (isBlank(searchFilter)) {
        // Условие поиска не задано.
        return;
      }

      let loadedOrganizations = get(this, 'model');
      let organizationSatisfyingSearchFilter = loadedOrganizations.find((organization) => {
        let organizationName = get(organization, 'name') || '';
        return organizationName.search(new RegExp(searchFilter, 'gi')) >= 0;
      });

      if (isNone(organizationSatisfyingSearchFilter)) {
        // Ничего не найдено.
        return;
      }

      // Осуществляем переход к контактам, удовлетворяющим усовиям поиска.
      this.transitionToRoute('master-page.contacts.organization', get(organizationSatisfyingSearchFilter, 'id'));
    }
  }
});
