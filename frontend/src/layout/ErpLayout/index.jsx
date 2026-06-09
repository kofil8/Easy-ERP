import { ErpContextProvider } from '@/context/erp';

import PageLayout from '@/components/PageLayout';

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <PageLayout maxWidth="1100px" minHeight="600px">
        {children}
      </PageLayout>
    </ErpContextProvider>
  );
}
