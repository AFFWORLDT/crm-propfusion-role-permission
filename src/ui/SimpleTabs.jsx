import React from 'react';

const tabStyles = {
    tabContainer: {
        width: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        backgroundColor: '#ffffff',
        padding: '4px 4px 0 4px',
    },
    tabList: {
        display: 'inline-flex',
        padding: '0',
        margin: 0,
        listStyle: 'none',
        minWidth: 'max-content',
        gap: '2px',
    },
    tabItem: {
        padding: '12px 24px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        color: '#64748b',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '1rem',
        borderTopRightRadius: '1rem',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
    },
    activeTab: {
        backgroundColor: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderBottom: 'none',
    },
    loadingBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '2px',
        backgroundColor: '#3b82f6',
        animation: 'loading 1s infinite linear',
    }
};

function SimpleTabs({ 
    tabs, 
    activeTab,
    onTabChange,
    isLoading = false,
    containerStyles = {},
    tabListStyles = {},
    tabItemStyles = {},
    activeTabStyles = {}
}) {
    return (
        <div 
            style={{ ...tabStyles.tabContainer, ...containerStyles }}
            className="hide-scrollbar"
        >
            <style>
                {`
                    @keyframes loading {
                        0% { width: 0; left: 0; }
                        50% { width: 100%; left: 0; }
                        100% { width: 0; left: 100%; }
                    }
                `}
            </style>
            <ul style={{ ...tabStyles.tabList, ...tabListStyles }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <li
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                                ...tabStyles.tabItem,
                                ...tabItemStyles,
                                ...(isActive ? {
                                    ...tabStyles.activeTab,
                                    backgroundColor: tab.bgColor,
                                    color: tab.fontColor,
                                    ...activeTabStyles
                                } : {})
                            }}
                        >
                            {tab.label}
                            {isActive && isLoading && (
                                <div style={tabStyles.loadingBar} />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default SimpleTabs; 