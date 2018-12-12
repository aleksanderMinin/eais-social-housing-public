import BaseModel from 'ember-flexberry-data/models/model';
import DS from 'ember-data';
import Projection from 'ember-flexberry-data/utils/attributes';
import { get, computed } from '@ember/object';
import { isBlank } from '@ember/utils';

let Model = BaseModel.extend({
  surname: DS.attr('string'),
  name: DS.attr('string'),
  patronymic: DS.attr('string'),
  fullName: DS.attr('string'),
  position: DS.attr('string'),
  phone: DS.attr('string'),
  email: DS.attr('string'),
  additionalInformation: DS.attr('string'),
  organization: DS.belongsTo('e-a-i-s-public-application-organization', { inverse: null, async: false }),

  /**
    Флаг: заданы ли ФИО.

    @property hasFullName
    @type Boolean
    @readOnly
  */
  hasFullName: computed('fullName', function() {
    let fullName = get(this, 'fullName');

    return !isBlank(fullName);
  }),

  /**
    Флаг: задан ли номер телефона.

    @property hasPhone
    @type Boolean
    @readOnly
  */
  hasPhone: computed('phone', function() {
    let phone = get(this, 'phone');

    return !isBlank(phone);
  }),

  /**
    Флаг: задан ли email.

    @property hasEmail
    @type Boolean
    @readOnly
  */
  hasEmail: computed('email', function() {
    let email = get(this, 'email');

    return !isBlank(email);
  }),

  /**
    Флаг: задана ли контактная информация для данного специалста.

    @property hasContactInformation
    @type Boolean
    @readOnly
  */
  hasContactInformation: computed('hasPhone', 'hasEmail', function() {
    let hasPhone = get(this, 'hasPhone');
    let hasEmail = get(this, 'hasEmail');

    return hasPhone && hasEmail;
  })
});

Model.defineProjection('SpecialistL', 'e-a-i-s-public-application-specialist', {
  organization: Projection.belongsTo('e-a-i-s-public-application-organization', 'Орган', {
  }, { hiden: true }),
  surname: Projection.attr('Фамилия', { hidden: true }),
  name: Projection.attr('Имя', { hidden: true }),
  patronymic: Projection.attr('Отчество', { hidden: true }),
  fullName: Projection.attr('ФИО'),
  position: Projection.attr('Должность'),
  additionalInformation: Projection.attr('Дополнитльная информация'),
  phone: Projection.attr('Номер телефона'),
  email: Projection.attr('Адрес электронной почты')
});

export default Model;
