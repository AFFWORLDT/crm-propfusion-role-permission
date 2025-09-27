import { useRef, useCallback, useEffect } from "react";
import useInfiniteTenants from "../../features/Tenants/useInfiniteTenants";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import { TENANT_OWNER_CONTRACT_TABS } from "../../utils/constants";
import NewTenantsListCard from "../../features/NewTenants/NewTenantsListCard";

function NewTenentsList() {
    const {
        tenants,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
        totalSize,
        error,
    } = useInfiniteTenants();
    const containerRef = useRef(null);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage =
            (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);
    return (
        <div className="sectionContainer">
            <SectionTop heading={`New Tenants List`}>
                <TabBar
                    tabs={TENANT_OWNER_CONTRACT_TABS}
                    activeTab={"TENANTS"}
                />
            </SectionTop>
            <section
                className="sectionStyles"
                ref={containerRef}
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    height: "calc(100vh)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <NewTenantsListCard
                    data={tenants}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    isLoading={isLoading}
                    error={error}
                    totalSize={totalSize}
                />
            </section>
        </div>
    );
}

export default NewTenentsList;
