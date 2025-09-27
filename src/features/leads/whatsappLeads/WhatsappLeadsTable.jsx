import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Table from "../../../ui/Table";
import Spinner from "../../../ui/Spinner";
import WhatsappLeadRow from "./WhatsappLeadRow";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";

function WhatsappLeadsTable({
    data,
    isLoading,
    containerRef,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sort_order = searchParams.get("sort_order") || "DESC";

    const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage =
            (scrollTop / (scrollHeight - clientHeight)) * 100;

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

    function handleSort() {
        const newSortOrder = sort_order === "ASC" ? "DESC" : "ASC";
        searchParams.set("sort_order", newSortOrder);
        setSearchParams(searchParams);
    }

    if (isLoading && !data?.length) {
        return <Spinner type="fullPage" />;
    }

    if (!data?.length) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#666",
                    fontSize: "1.6rem",
                }}
            >
                No whatsapp leads found
            </div>
        );
    }

    return (
        <>
            <Table
                columns="1.8fr 0.5fr 1.27fr 1fr 1.30fr 1.8fr 1.20fr 1.25fr 1fr 1.6fr 1.7fr"
                rowWidth="200rem"
                transparent={true}
                hasShadow={true}
                hasBorder={true}
            >
                <Table.Header>
                    <div
                        role="button"
                        onClick={handleSort}
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.8rem",
                            fontWeight: "600",
                        }}
                    >
                        <span>Lead Time</span>
                        {sort_order === "ASC" ? (
                            <HiArrowUp
                                style={{ width: "1.8rem", height: "1.8rem" }}
                            />
                        ) : (
                            <HiArrowDown
                                style={{ width: "1.8rem", height: "1.8rem" }}
                            />
                        )}
                    </div>
                    <div>Portal</div>
                    <div>Sender</div>
                    <div>Agent</div>
                    <div>Area Info</div>
                    <div>Property Id</div>
                    <div>Status</div>
                    <div>Property Link</div>
                    <div>Operations</div>
                    <div>Tags</div>
                    <div>Lead id </div>
                </Table.Header>
                <Table.Body
                    data={data}
                    render={(whatsappLeadObj) => (
                        <WhatsappLeadRow
                            whatsappLeadData={whatsappLeadObj}
                            key={whatsappLeadObj.lead_id}
                        />
                    )}
                />
            </Table>
            {isFetchingNextPage && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "2.5rem",
                        backgroundColor: "transparent",
                    }}
                >
                    <Spinner />
                </div>
            )}
        </>
    );
}

export default WhatsappLeadsTable;
