import { createEnum } from 'ember-flexberry-data/utils/enum-functions';

export default createEnum({
  V_ocheredi: 'В очереди',
  V_predvaritelnom_spiske: 'В предварительном списке',
  V_spiske_na_vyplatu: 'В списке на выплату',
  Iscliuchen_iz_ocheredi: 'Исключен из очереди',
  Vydan_sertifikat: 'Выдан сертификат',
  Realizovan_sertifikat: 'Реализован сертификат'
});
