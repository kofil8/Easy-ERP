import DashboardModule from '@/modules/DashboardModule';
import PageLayout from '@/components/PageLayout';

export default function Dashboard() {
  return (
    <PageLayout variant="plain">
      <DashboardModule />
    </PageLayout>
  );
}
