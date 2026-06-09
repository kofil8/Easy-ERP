import { ErpLayout } from '@/layout';
import useLanguage from '@/locale/useLanguage';
import ErpPanel from '@/modules/ErpPanelModule';

export default function PaymentMode() {
  const translate = useLanguage();
  const entity = 'paymentMode';

  const config = {
    entity,
    DATATABLE_TITLE: translate('payment_mode_list'),
    ADD_NEW_ENTITY: translate('add_new_payment_mode'),
    ENTITY_NAME: translate('payment_mode'),
    disableAdd: true,
    searchConfig: {
      entity: 'paymentMode',
      displayLabels: ['name'],
      searchFields: 'name',
    },
    dataTableColumns: [
      {
        title: translate('name'),
        dataIndex: 'name',
      },
      {
        title: translate('description'),
        dataIndex: 'description',
      },
    ],
  };

  return (
    <ErpLayout>
      <ErpPanel config={config} />
    </ErpLayout>
  );
}
