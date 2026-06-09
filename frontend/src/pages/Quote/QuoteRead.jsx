import useLanguage from '@/locale/useLanguage';
import ReadQuoteModule from '@/modules/QuoteModule/ReadQuoteModule';

export default function QuoteRead() {
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

  return <ReadQuoteModule config={config} />;
}
