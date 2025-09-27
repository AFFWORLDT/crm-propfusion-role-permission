import { useCallback, useEffect, useRef } from "react";
import styles from "./../../../styles/PhoneView.module.css"
import SectionTop from "../../../ui/SectionTop";
import { LEAD_TABS_TYPE_OPTIONS } from "../../../utils/constants";
import TabBar from "../../../ui/TabBar";
import ScrollToTop from "../../../ui/ScrollToTop";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import useWhatapp from "../../../features/leads/Phone/useWhatsapp";
import Table from "../../../ui/Table";

const WhatAppView = () => {
    const { 
        isLoading, 
        portalCalls,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useWhatapp();

    const containerRef = useRef(null);
    const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            console.log('Fetching next page...', { scrollPercentage, hasNextPage, isFetchingNextPage });
            fetchNextPage();
        }
    }, [containerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const currentRef = containerRef?.current;
        if (!currentRef) return;

        currentRef.addEventListener("scroll", handleScroll);
        return () => currentRef.removeEventListener("scroll", handleScroll);
    }, [containerRef, handleScroll]);

    const currentTab = LEAD_TABS_TYPE_OPTIONS.find(
        (tab) => tab.id === "WHATAPP-VIEW"
    );
    const bgColor = currentTab?.bgColor || "#ffffff";

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading && !portalCalls?.length) {
        return <Spinner type="fullPage" />;
    }

    if (!portalCalls?.length) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: '#666'
            }}>
                No portal calls found
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading={`WHATAPP VIEW`}>
                <TabBar
                    tabs={[
                        LEAD_TABS_TYPE_OPTIONS[3],
                        LEAD_TABS_TYPE_OPTIONS[4],
                        LEAD_TABS_TYPE_OPTIONS[5],
                        LEAD_TABS_TYPE_OPTIONS[6],
                        LEAD_TABS_TYPE_OPTIONS[7],
                    ]}
                    activeTab={"Whatsapp View"}
                    navigateTo={(tabId) => `/leads/${tabId.toLowerCase()}`}
                />
            </SectionTop>
            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "6rem",
                    paddingLeft: "3rem",
                    backgroundColor: bgColor,
                    height: "calc(100vh)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style>
                    {`
                        .sectionStyles::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>WHATAPP Views Analytics</h1>
                        <p className={styles.subtitle}>Total WHATAPP VIEW: {portalCalls.length} | Last Updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <Table columns="1fr 2fr 2fr 1fr 1fr 1fr">
                        <Table.Header>
                            <div>Date</div>
                            <div>Property</div>
                            <div>Agent</div>
                            <div>Reference</div>
                            <div>Source</div>
                            <div>Whatsapp views</div>
                        </Table.Header>
                        <Table.Body 
                            data={portalCalls}
                            render={(item) => (
                                <Table.Row key={item.id}>
                                    <div>{item.date_time}</div>
                                    <div>
                                        {item.property_info ? (
                                            <div>
                                                <div className={styles.propertyTitle}>{item.property_info.title}</div>
                                                <span className={`${styles.badge} ${item.property_info.listingType === "SELL" ? styles.badgeSell : styles.badgeRent}`}>
                                                    {item.property_info.listingType}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className={styles.unavailable}>N/A</span>
                                        )}
                                    </div>
                                    <div>
                                        {item.agent_info ? (
                                            <div className={styles.agentInfo}>
                                                {item.agent_info.avatar ? (
                                                    <img src={item?.agent_info?.avatar} alt={item.agent_info.name} className={styles.avatar} />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        {item.agent_info.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className={styles.agentDetails}>
                                                    <div className={styles.agentName}>{item.agent_info.name}</div>
                                                    <div className={styles.agentPhone}>{item.agent_info.phone}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className={styles.unavailable}>N/A</span>
                                        )}
                                    </div>
                                    <div>{item.listing_reference || <span className={styles.unavailable}>N/A</span>}</div>
                                    <div>
                                        <span className={`${styles.badge} ${item.source === "bayut" ? styles.badgeBayut : styles.badgeDubizzle}`}>
                                            {item.source}
                                        </span>
                                    </div>
                                    <div>{item.whatsapp_views}</div>
                                </Table.Row>
                            )}
                        />
                    </Table>
                </div>
                <ScrollToTop containerRef={containerRef} />
                {isFetchingNextPage && (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '2rem',
                        backgroundColor: 'transparent' 
                    }}>
                        <Spinner />
                    </div>
                )}
            </section>
        </div>
    );
};

export default WhatAppView;