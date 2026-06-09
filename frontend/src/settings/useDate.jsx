import { selectAppSettings } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const useDate = () => {
  const app_settings = useSelector(selectAppSettings);
  const dateFormat = app_settings?.easy_app_date_format ?? 'DD/MM/YYYY';
  return {
    dateFormat,
  };
};

export default useDate;
