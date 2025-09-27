import Table from "../../ui/Table";
import { useEffect, useRef, useCallback } from "react";
import OwnerMenus from "./OwnerMenus";
import AssignedOwnerButton from "../Tenants/AssinedOwnerButton";
import useCountries from "../../hooks/useCountries";

function NewOwnersInTable({
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}) {
    const columns = "1fr 1fr 1fr 1fr 1fr 1.5fr 1fr ";
    const rowWidth = "170rem";
    const tableContainerRef = useRef(null);
    const { data: countriesData = [] } = useCountries();

    const handleScroll = useCallback(() => {
        if (!tableContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } =
            tableContainerRef.current;
        const scrollPercentage =
            (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = tableContainerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div
            ref={tableContainerRef}
            style={{
                maxHeight: "calc(100vh - 200px)",
                height: "100%",
                overflowY: "auto",
                overflowX: "auto",
                position: "relative",
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "1rem",
            }}
        >
            <Table columns={columns} rowWidth={rowWidth}>
                <Table.Header>
                    <div>Investor</div>
                    <div>License No</div>
                    <div>Email</div>
                    <div>Phone</div>
                    <div>Nationality</div>
                    <div>Assign Agent</div>
                    <div>Actions</div>
                </Table.Header>
                <Table.Body
                    data={data}
                    render={(owner) => (
                        <Table.Row key={owner.id}>
                            <div>{owner.owner_name}</div>
                            <div>{owner.license_no}</div>
                            <div>{owner.lessor_email}</div>
                            <div>{owner.lessor_phone}</div>
                            <div>
                                {(() => {
                                    const country = countriesData.find(
                                        (c) =>
                                            c.name.common === owner.nationality
                                    );
                                    return country ? (
                                        <img
                                            src={country.flags.png}
                                            alt={owner.nationality}
                                            style={{
                                                width: "32px",
                                                height: "22px",
                                                objectFit: "contain",
                                                borderRadius: "3px",
                                                border: "1px solid #eee",
                                                background: "#fff",
                                            }}
                                        />
                                    ) : (
                                        owner.nationality || "-"
                                    );
                                })()}
                            </div>
                            <div>
                                {owner.assigned_agent_name ||
                                owner.agent_name ? (
                                    <>
                                        <AssignedOwnerButton
                                            id={owner.id}
                                            name={
                                                owner.assigned_agent_name ||
                                                owner.agent_name
                                            }
                                            ownerName={owner.owner_name}
                                        />
                                    </>
                                ) : (
                                    <AssignedOwnerButton
                                        id={owner.id}
                                        name={
                                            owner.assigned_agent_name ||
                                            owner.agent_name
                                        }
                                        ownerName={owner.owner_name}
                                    />
                                )}
                            </div>
                            <div>
                                <OwnerMenus ownerId={owner.id} />
                            </div>
                        </Table.Row>
                    )}
                />
            </Table>
            {isFetchingNextPage && (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                    Loading more...
                </div>
            )}
            {!hasNextPage && !isFetchingNextPage && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "1rem",
                        color: "#666",
                    }}
                >
                    No more data here
                </div>
            )}
        </div>
    );
}

export default NewOwnersInTable;
