import React from 'react';
import styles from '../styles/CompanyFooter.module.css';

const CompanyFooter = ({ companyData }) => {
  if (!companyData) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.companyInfo}>
          {companyData.company_logo_url && (
            <img src={companyData.company_logo_url} alt={companyData.company_name} className={styles.companyLogo} />
          )}
          <h3 className={styles.companyName}>{companyData.company_name}</h3>
          {companyData.brief_of_company && (
            <p className={styles.companyDescription}>{companyData.brief_of_company}</p>
          )}
        </div>

        <div className={styles.contactInfo}>
          <h3>Contact Us</h3>
          {companyData.address && <p>{companyData.address}</p>}
          {companyData.contact_number && <p>Phone: {companyData.contact_number}</p>}
          <a href={"https://www.onexproperty.com"} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
            Visit our website
          </a>
        </div>

        <div className={styles.legalInfo}>
          <h3>Company Information</h3>
          {companyData.orn_no && <p>ORN: {companyData.orn_no}</p>}
          <p className={styles.copyright}>© {new Date().getFullYear()} {companyData.company_name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;


