import { ErpLayout } from '@/layout';
import useLanguage from '@/locale/useLanguage';
import ErpPanel from '@/modules/ErpPanelModule';

export default function Taxes() {
  const translate = useLanguage();
  const entity = 'taxes';

  const config = {
    entity,
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('taxes'),
    disableAdd: true,
    searchConfig: {
      entity: 'taxes',
      displayLabels: ['name'],
      searchFields: 'name',
    },
    dataTableColumns: [
      {
        title: translate('name'),
        dataIndex: 'name',
      },
      {
        title: translate('select_tax_value'),
        dataIndex: 'value',
      },
    ],
  };

  return (
    <ErpLayout>
      <ErpPanel config={config} />
    </ErpLayout>
  );
}
