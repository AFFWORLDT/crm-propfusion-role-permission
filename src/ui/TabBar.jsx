import { useNavigate } from "react-router-dom";

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
        // '&::-webkit-scrollbar': {
        //     display: 'none'
        // }
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
    },
    activeTab: {
        backgroundColor: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderBottom: 'none',
    }
};

function TabBar({ 
    tabs, 
    activeTab, 
    onTabClick,
    navigateTo,
    containerStyles = {},
    tabListStyles = {},
    tabItemStyles = {},
    activeTabStyles = {}
}) {
    const navigate = useNavigate();
console.log(tabs)
    const handleTabClick = (tabId) => {
        if (onTabClick) {
            onTabClick(tabId);
        } else if (navigateTo) {
            navigate(navigateTo(tabId));
        }
    };

    return (
        <div 
            style={{ ...tabStyles.tabContainer, ...containerStyles }}
            className="hide-scrollbar"
        >
            <ul style={{ ...tabStyles?.tabList, ...tabListStyles }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab?.id;
                    return (
                        <li
                            key={tab?.id}
                            onClick={() => handleTabClick(tab?.id)}
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
                            {tab?.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default TabBar; 