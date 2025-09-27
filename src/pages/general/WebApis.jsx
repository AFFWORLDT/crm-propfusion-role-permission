import React from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import styles from './WebApis.module.css';
import { getApiUrl } from '../../utils/getApiUrl';
import SectionTop from '../../ui/SectionTop';
import TabBar from '../../ui/TabBar';
import { WEB_APIS_TABS } from '../../utils/constants';

const WebApis = () => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const apiEndpoints = [
    `properties/get_areas_with_property_counts?size=100&page=1`,
    `properties/get_developers_with_property_counts?size=100&page=1`,
    `properties/get_new_properties?size=10&listing_type=SELL&sort_by_date=DESC&status=ACTIVE&page=1`,
    `properties/get_new_properties?size=10&property_id=39880`,
    `get_new_properties?size=10&listing_type=RENT&sort_by_date=DESC&status=ACTIVE&page=2`,
    `properties/projects?size=10&sort_by_date=DESC&project_status=ACTIVE&page=1`,
    `admin/company`,
    `agent/all`
  ];

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="sectionContainer">
      <SectionTop heading="APIs Endpoints">
        <TabBar
          tabs={WEB_APIS_TABS}
          activeTab={"WEB_APIS"}
          navigateTo={(id) => WEB_APIS_TABS.find(tab => tab.id === id)?.path || '/admin/general/web-apis'}
        />
      </SectionTop>
      <section className="sectionStyles" style={{ backgroundColor: WEB_APIS_TABS[0].bgColor }}>
        <div className={styles.container}>
          <h1 className={styles.title}>API Endpoints</h1>
          <div className={styles.endpointList}>
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className={styles.endpointCard}>
                <div className={styles.endpointContent}>
                  <code className={styles.endpointText}>
                    {`${getApiUrl()}/${endpoint}`}
                  </code>
                  <button
                    onClick={() => handleCopy( `${getApiUrl()}/${endpoint}` , index)}
                    className={`${styles.copyButton} ${copiedIndex === index ? styles.copied : ''}`}
                    aria-label="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <CheckCheck className={styles.icon} />
                    ) : (
                      <Copy className={styles.icon} />
                    )}
                    <span className={styles.buttonText}>
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
                <div className={styles.endpointMethod}>GET</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebApis;