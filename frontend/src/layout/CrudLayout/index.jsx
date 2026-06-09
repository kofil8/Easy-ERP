import DefaultLayout from '../DefaultLayout';

import SidePanel from '@/components/SidePanel';
import PageLayout from '@/components/PageLayout';

const ContentBox = ({ children }) => {
  return (
    <PageLayout
      maxWidth="100%"
      style={{
        flex: 'none',
      }}
    >
      {children}
    </PageLayout>
  );
};

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  sidePanelBottomContent,
  fixHeaderPanel,
}) {
  return (
    <>
      <DefaultLayout>
        <SidePanel
          config={config}
          topContent={sidePanelTopContent}
          bottomContent={sidePanelBottomContent}
          fixHeaderPanel={fixHeaderPanel}
        />

        <ContentBox> {children}</ContentBox>
      </DefaultLayout>
    </>
  );
}
