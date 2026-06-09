import Profile from './components/Profile';
import ProfileLayout from '@/layout/ProfileLayout';
import PageLayout from '@/components/PageLayout';

export default function ProfileModule({ config }) {
  return (
    <ProfileLayout>
      <PageLayout maxWidth="1100px">
        <Profile config={config} />
      </PageLayout>
    </ProfileLayout>
  );
}
