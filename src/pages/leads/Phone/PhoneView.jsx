import { useCallback, useEffect, useRef } from "react";
import SectionTop from "../../../ui/SectionTop";
import { LEAD_TABS_TYPE_OPTIONS } from "../../../utils/constants";
import TabBar from "../../../ui/TabBar";
import useInfinitePhone from "../../../features/leads/Phone/usePhoneLeades";
import ScrollToTop from "../../../ui/ScrollToTop";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";

const PhoneView = () => {
    const {
        isLoading,
        phoneViews,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePhone();
    const data = phoneViews;

    const containerRef = useRef(null);
    
    const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        // Calculate how far we've scrolled
        const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100;

        if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const currentRef = containerRef?.current;
        if (!currentRef) return;

        currentRef.addEventListener("scroll", handleScroll);
        return () => currentRef.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading && !data?.length) {
        return <Spinner type="fullPage" />;
    }

    if (!data?.length) {
        return (
            <div>
                No portal calls found
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    tabs={[
                        LEAD_TABS_TYPE_OPTIONS[3],
                        LEAD_TABS_TYPE_OPTIONS[4],
                        LEAD_TABS_TYPE_OPTIONS[5],
                        LEAD_TABS_TYPE_OPTIONS[6],
                        LEAD_TABS_TYPE_OPTIONS[7],
                    ]}
                    activeTab={"Phone View"}
                    navigateTo={(tabId) => `/leads/${tabId.toLowerCase()}`}
                />
            </SectionTop>
            <section 
                ref={containerRef} 
                className="sectionStyles"
                style={{
                    backgroundColor: "#fff",
                    // height: "calc(100vh - 90px)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    position: "relative",
                    WebkitOverflowScrolling: "touch"
                }}
            >
                <div className="px-3">
                    <Table 
                        columns="1fr 2fr 2fr 1fr 1fr 1fr"
                        hasShadow={true}
                        hasBorder={true}
                    >
                        <Table.Header>
                            <div>Date</div>
                            <div>Property</div>
                            <div>Agent</div>
                            <div>Reference</div>
                            <div>Source</div>
                            <div>Views</div>
                        </Table.Header>
                        <Table.Body 
                            data={data}
                            render={(item, index) => (
                                <Table.Row key={index}>
                                    <div>{item.date_time}</div>
                                    <div>
                                        {item.property_info ? (
                                            <div>
                                                <div>
                                                    {item.property_info.title}
                                                </div>
                                                <span>
                                                    {item.property_info.listingType}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </div>
                                    <div>
                                        {item.agent_info ? (
                                            <div className="d-flex align-items-center gap-2">
                                                {item.agent_info.avatar ? (
                                                    <img
                                                        src={item?.agent_info?.avatar}
                                                        alt={item.agent_info.name}
                                                        className="rounded-circle"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                ) : (
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                                                         style={{ width: '40px', height: '40px', borderRadius: '50%' }}>
                                                        {item.agent_info.name.charAt(0)}
                                                    </div>
                                                )}
                                                {/* <div className="d-flex flex-column">
                                                    <div className="fw-bold">
                                                        {item.agent_info.name}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {item.agent_info.phone}
                                                    </div>
                                                </div> */}
                                            </div>
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </div>
                                    <div>
                                        {item.listing_reference || (
                                            <span>N/A</span>
                                        )}
                                    </div>
                                    <div>
                                        <span>
                                            {item.source}
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            {item.phone_views}
                                        </span>
                                    </div>
                                </Table.Row>
                            )}
                        />
                    </Table>
                </div>
                <ScrollToTop containerRef={containerRef} />
                {isFetchingNextPage && (
                    <div className="text-center py-3">
                        <Spinner />
                    </div>
                )}
            </section>
        </div>
    );
};

export default PhoneView;
