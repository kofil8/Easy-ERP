import useLanguage from '@/locale/useLanguage';
import UpdateQuoteModule from '@/modules/QuoteModule/UpdateQuoteModule';

export default function QuoteUpdate() {
  const translate = useLanguage();
  const entity = 'quote';

  const Labels = {
    PANEL_TITLE: translate('quote'),
    DATATABLE_TITLE: translate('quote_list'),
    ENTITY_NAME: translate('quote'),
  };

  const config = {
    entity,
    ...Labels,
  };

  return <UpdateQuoteModule config={config} />;
}
