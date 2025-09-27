import React from 'react';
import { useTranslation } from 'react-i18next';
// ... other imports ...

const CustomSideNav = () => {
  const { t } = useTranslation();
  
  return (
    <div className="custom-side-nav">
      <div className="nav-item">
        <span>{t('common.dashboard')}</span>
      </div>
      <div className="nav-item">
        <span>{t('common.properties')}</span>
      </div>
      <div className="nav-item">
        <span>{t('common.customers')}</span>
      </div>
      <div className="nav-item">
        <span>{t('common.agents')}</span>
      </div>
      <div className="nav-item">
        <span>{t('common.reports')}</span>
      </div>
      <div className="nav-item">
        <span>{t('common.settings')}</span>
      </div>
    </div>
  );
};

export default CustomSideNav; 