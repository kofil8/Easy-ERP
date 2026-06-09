import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'Easy ERP'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://kofil.online">www.kofil.online</a>{' '}
          </p>
          <p>
            GitHub :{' '}
            <a href="https://github.com/kofil8/easy-erp" target="_blank" rel="noopener noreferrer">
              https://github.com/kofil8/easy-erp
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://kofil.online`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
