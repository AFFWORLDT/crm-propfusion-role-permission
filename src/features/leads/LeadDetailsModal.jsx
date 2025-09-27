import Modal from '../../ui/Modal';
import { useState } from 'react';
import styles from '../../styles/LeadDetailsModal.module.css';

const LeadDetailsModal = ({ leadData }) => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    
    if (!leadData) return null;

    // Function to safely stringify data without circular references
    const safeStringify = (obj) => {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, val) => {
            if (val != null && typeof val === "object") {
                if (seen.has(val)) {
                    return '[Circular Reference]';
                }
                seen.add(val);
            }
            return val;
        }, 2);
    };

    // Function to format lead data for display
    const formatLeadData = (data) => {
        const basicInfo = {
            'ID': data.id,
            'Submission ID': data.submission_id,
            'Name': data.name,
            'Email': data.email,
            'Phone': data.phone,
            'Status': data.status,
            'Client Type': data.clientType,
            'Client Source': data.clientSource,
            'Client Sub Source': data.clientSubSource,
            'Create Time': data.createTime,
            'Update Time': data.updateTime,
            'IP Address': data.ip_address,
            'Leads Message': data.leads_message,
            'Notes': data.notes
        };

        const customFields = data.custom_fields || {};
        const rawData = data.raw_webhook_data || data.raw_submission || {};

        return {
            basicInfo,
            customFields,
            rawData
        };
    };

    const handleCopy = async () => {
        try {
            const formattedData = formatLeadData(leadData);
            await navigator.clipboard.writeText(safeStringify(formattedData));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const formattedData = formatLeadData(leadData);

    const renderBasicInfo = () => (
        <div className={styles.basicInfo}>
            {Object.entries(formattedData.basicInfo).map(([key, value]) => (
                <div key={key} className={styles.infoRow}>
                    <strong>{key}:</strong>
                    <span>{value || 'N/A'}</span>
                </div>
            ))}
        </div>
    );

    const renderCustomFields = () => (
        <div className={styles.customFields}>
            <h4>Custom Fields</h4>
            {Object.entries(formattedData.customFields).map(([key, value]) => (
                <div key={key} className={styles.infoRow}>
                    <strong>{key}:</strong>
                    <span>
                        {Array.isArray(value) 
                            ? value.join(', ') 
                            : typeof value === 'object' 
                                ? JSON.stringify(value, null, 2) 
                                : String(value || 'N/A')}
                    </span>
                </div>
            ))}
        </div>
    );

    const renderRawData = () => (
        <div className={styles.rawData}>
            <h4>Raw Data</h4>
            <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                padding: '16px',
                maxHeight: '400px',
                overflow: 'auto',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <pre style={{
                    fontSize: '12px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    fontFamily: 'monospace',
                    color: '#495057',
                    margin: 0,
                    minWidth: 'fit-content',
                    maxWidth: '100%'
                }}>
                    {safeStringify(formattedData.rawData)}
                </pre>
            </div>
        </div>
    );

    return (
        <Modal>
            <Modal.Open openWindowName="leadDetails">
                <button
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer !important ',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <img
                        src="/icons/info.svg"
                        alt="details"
                        style={{
                            width: '14px',
                            height: '14px',
                            opacity: 0.7,
                        }}
                    />
                    Details
                </button>
            </Modal.Open>
            <Modal.Window name="leadDetails">
                <div style={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    width: '100%',
                    padding: '20px'
                }}
               
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1f2937',
                            margin: 0
                        }}>
                            Lead Details
                        </h3>
                        <button
                            onClick={handleCopy}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: copied ? '#10b981' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!copied) {
                                    e.target.style.backgroundColor = '#2563eb';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!copied) {
                                    e.target.style.backgroundColor = '#3b82f6';
                                }
                            }}
                        >
                            {copied ? (
                                <>
                                    <svg 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        <polyline points="20,6 9,17 4,12"></polyline>
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Copy
                                </>
                            )}
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{
                        display: 'flex',
                        borderBottom: '1px solid #e5e7eb',
                        marginBottom: '20px'
                    }}>
                        {['basic', 'custom', 'raw'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: activeTab === tab ? '#3b82f6' : 'transparent',
                                    color: activeTab === tab ? 'white' : '#6b7280',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {tab === 'basic' ? 'Basic Info' : 
                                 tab === 'custom' ? 'Custom Fields' : 'Raw Data'}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'basic' && renderBasicInfo()}
                        {activeTab === 'custom' && renderCustomFields()}
                        {activeTab === 'raw' && renderRawData()}
                    </div>
                </div>
            </Modal.Window>
        </Modal>
    );
};

export default LeadDetailsModal; 