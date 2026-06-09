const useAppSettings = () => {
  let settings = {};
  settings['easy_app_email'] = 'noreply@easyapp.com';
  settings['easy_base_url'] = 'https://cloud.easyapp.com';
  return settings;
};

module.exports = useAppSettings;
