const useDate = ({ settings }) => {
  const { easy_app_date_format } = settings;

  const dateFormat = easy_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;
