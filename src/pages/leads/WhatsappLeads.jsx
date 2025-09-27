import { useEffect, useRef, useState, useCallback } from "react";
import WhatsappLeadsFilter from "../../features/leads/whatsappLeads/WhatsappLeadsFilter";
import WhatsappLeadsTable from "../../features/leads/whatsappLeads/WhatsappLeadsTable";
import WhatsappLeadsCard from "../../features/leads/whatsappLeads/WhatsappLeadsCard";
import SectionTop from "../../ui/SectionTop";
import toast from "react-hot-toast";
import useInfiniteWhatsappLeads from "../../features/leads/whatsappLeads/useInfiniteWhatsappLeads";
import Tags from "../../features/tags/Tags";
import SyncLeadButton from "./SyncLeadButton";
import TabBar from "../../ui/TabBar";
import { LEAD_TABS_TYPE_OPTIONS, WP_LEAD_CLAIM_OPTIONS } from "../../utils/constants";
import ToggleButton from "../../ui/ToggleButton";
import { Search } from "lucide-react";
import ViewToggleButton from "../../ui/ViewToggleButton";
import ExtraFilters from "../../ui/ExtraFilters";
import ScrollToTop from "../../ui/ScrollToTop";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";


function WhatsappLeads() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedValue, setSelectedValue] = useState(() => {
        const storedValue = localStorage.getItem('wpLeadClaimFilter');
        const urlValue = searchParams.get("claimed");
        return storedValue || urlValue || WP_LEAD_CLAIM_OPTIONS[2].value;
    });

    const { register } = useForm({
        defaultValues: {
            claimed: selectedValue
        }
    });

    useEffect(() => {
        const currentUrlValue = searchParams.get("claimed");
        if (currentUrlValue !== selectedValue) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set("claimed", selectedValue);
                return newParams;
            }, { replace: true });
        }
        localStorage.setItem('wpLeadClaimFilter', selectedValue);
    }, [selectedValue, setSearchParams, searchParams]);

    const {
        isLoading,
        whatsappLeads,
        totalSize,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteWhatsappLeads();
    const containerRef = useRef(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const currentTab = LEAD_TABS_TYPE_OPTIONS.find(
        (tab) => tab.id === "whatsapp-leads"
    );

    const handleClaimedChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);
    };

    const viewType = searchParams.get("viewType") || "table";

    const handleViewChange = (newView) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("viewType", newView);
            return newParams;
        }, { replace: true });
    };

    const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [containerRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        const currentRef = containerRef?.current;
        if (!currentRef) return;

        currentRef.addEventListener("scroll", handleScroll);
        return () => currentRef.removeEventListener("scroll", handleScroll);
    }, [containerRef, handleScroll]);

    return (
        <div className="sectionContainer">
            <SectionTop heading="Whatsapp Leads">
                <TabBar
                    tabs={[
                        // LEAD_TABS_TYPE_OPTIONS[3],
                        LEAD_TABS_TYPE_OPTIONS[4],
                        LEAD_TABS_TYPE_OPTIONS[5],
                        LEAD_TABS_TYPE_OPTIONS[6],
                        LEAD_TABS_TYPE_OPTIONS[7],
                    ]}
                    activeTab="whatsapp-leads"
                    navigateTo={(tabId) => `/leads/${tabId.toLowerCase()}`}
                />
            </SectionTop>

            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#fff",
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

                <div>
                    <ToggleButton>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "1rem",
                                marginBottom: "1rem",
                                paddingTop: "4rem",
                            }}
                        >
                            <div className="flex-between-wrap">
                                <ExtraFilters
                                    buttonOptions={[
                                        {
                                            label: "Active Leads",
                                            value: "ACTIVE",
                                        },
                                    ]}
                                    totalSize={totalSize}
                                    leadType="whatsapp-leads"
                                />
                                <Tags tagType="whatsapp_leads" />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div style={{ position: 'relative', minWidth: "200px" }}>
                                    <select
                                        {...register("claimed")}
                                        onChange={handleClaimedChange}
                                        value={selectedValue}
                                        style={{
                                            width: "100%",
                                            padding: "1.3rem 1rem",
                                            paddingRight: "2.5rem",
                                            fontSize: "1.5rem",
                                            lineHeight: "1.25rem",
                                            color: "#1a1a1a",
                                            backgroundColor: "#ffffff",
                                            borderRadius: "0.5rem",
                                            border: "1px solid #e2e8f0",
                                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                            appearance: "none",
                                            cursor: "pointer",
                                            transition: "all 0.15s ease-in-out"
                                        }}
                                    >
                                        {WP_LEAD_CLAIM_OPTIONS.map(option => (
                                            <option 
                                                key={option.value} 
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div style={{
                                        position: "absolute",
                                        right: "0.75rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        pointerEvents: "none",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4 6L8 10L12 6"
                                                stroke="#6B7280"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <ToggleButton.Button
                                    label="Advanced Filter"
                                    icon={<Search />}
                                    style={{
                                        "--toggleBtn-primary": "#000",
                                        border: "1px solid #000",
                                        backgroundColor: "transparent",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.5rem",
                                        color: "#000",
                                    }}
                                />
                                <SyncLeadButton />
                                <ViewToggleButton
                                    defaultView={viewType}
                                    viewParamName="viewType"
                                    onViewChange={handleViewChange}
                                />
                            </div>
                        </div>

                        <ToggleButton.Content>
                            <div
                                className="LEADSfilter"
                                style={{
                                    padding: "1.5rem",
                                    borderTop: "1px solid #eee",
                                    borderBottom: "1px solid #eee",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <WhatsappLeadsFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "table" ? (
                        <WhatsappLeadsTable
                            data={whatsappLeads}
                            isLoading={isLoading}
                            containerRef={containerRef}
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : (
                        <div>
                            <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "1rem",
                                padding: "1rem"
                            }}>
                                {whatsappLeads.map((lead) => (
                                    <WhatsappLeadsCard
                                        key={lead.lead_id}
                                        whatsappLeadData={lead}
                                    />
                                ))}
                            </div>
                            {isFetchingNextPage && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    padding: '2rem',
                                    backgroundColor: 'transparent',
                                    gridColumn: '1 / -1'
                                }}>
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default WhatsappLeads;
