import SectionTop from "../../ui/SectionTop";
import RentalAgreements from "../../features/rental-agreement/RentalAgreements";
import RentalAgreementsTable from "../../features/rental-agreement/RentalAgreementsTable";

import AddRentalAgreeMent from "../../features/rental-agreement/AddRentalAgreeMent";
import ViewToggleButton from "../../ui/ViewToggleButton";
import { useSearchParams } from "react-router-dom";
import useGetInfiteRentalAgreementList from "../../features/rental-agreement/useGetInfiniteRentalAgreementList";
import { useCallback, useRef } from "react";
import { useEffect } from "react";
import ExtraFilters from "../../ui/ExtraFilters";
import ToggleButton from "../../ui/ToggleButton";
import { Search } from "lucide-react";
import RentalAgreementFilter from "../../features/rental-agreement/RentalAgreementFilter";
import { RENTAL_AGREEMENT_TABS } from "../../utils/constants";
import TabBar from "../../ui/TabBar";
function ListRentalAgreements() {
    // const { agreements, isLoading, error } = useGetRentalAgreementList(true);
    const {
        agreements: data,
        isLoading: isLoadingInfinite,
        error: errorInfinite,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        totalSize,
    } = useGetInfiteRentalAgreementList();
    const [searchParams] = useSearchParams();
    const viewType = searchParams.get("viewType") || "card";
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
    const containerHeight = data?.length > 10 ? "100vh" : "auto";

    return (
        <div className="sectionContainer">
            <SectionTop >
                <TabBar
                    tabs={RENTAL_AGREEMENT_TABS}
                    activeTab={"RENTAL_AGREEMENT_LIST"}
                    navigateTo={(tabId) => {
                        const tab = RENTAL_AGREEMENT_TABS.find(t => t.id === tabId);
                        return tab ? tab.path : `/rental-agreement`;
                    }}
                />
            </SectionTop>
            <section
                className="sectionStyles"
                ref={containerRef}
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    height: containerHeight,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
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
                        <ExtraFilters
                            buttonOptions={[
                                { label: "Active", value: "ACTIVE" },
                                {
                                    label: "Inactive",
                                    value: "INACTIVE",
                                },
                                {
                                    label: "Draft",
                                    value: `DRAFT`,
                                },
                            ]}
                            totalSize={totalSize}
                        />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <ToggleButton.Button
                                label="Advanced Filter"
                                icon={<Search />}
                                style={{
                                    border: "1px solid #000",
                                    backgroundColor: "transparent",
                                    color: "#000",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <AddRentalAgreeMent />
                            <ViewToggleButton
                                defaultView="card"
                                viewParamName="viewType"
                            />
                        </div>
                    </div>
                    <ToggleButton.Content>
                        <div
                            className="LEADSfilter"
                            style={{
                                padding: "1.5rem",
                                borderTop: "1px solid #eee",
                                backgroundColor: "transparent",
                            }}
                        >
                            <RentalAgreementFilter />

                        </div>
                    </ToggleButton.Content>
                </ToggleButton>
                {viewType === "card" ? (
                    <RentalAgreements
                        isLoading={isLoadingInfinite}
                        error={errorInfinite}
                        data={data}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                ) : (
                    <RentalAgreementsTable
                        isLoading={isLoadingInfinite}
                        error={errorInfinite}
                        data={data}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}
            </section>
        </div>
    );
}

export default ListRentalAgreements;
