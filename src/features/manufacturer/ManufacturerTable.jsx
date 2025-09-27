import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table"; // Assuming a reusable Table component exists
import useInfiniteManufacturers from "./useInfiniteManufacturers";
import ManufacturerRow from "./ManufacturRow";

function ManufacturerTable({ containerRef }) {
    const {
        isLoading,
        manufacturers,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteManufacturers();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // Infinite scroll logic (same as other views)
    const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (
            scrollHeight - (scrollTop + clientHeight) < scrollHeight * 0.2 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage, containerRef]);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll);
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll, containerRef]);

    if (isLoading && manufacturers.length === 0) return <Spinner type="fullPage" />;
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>Error loading manufacturers.</p>;

    return (
        <div style={{ position: 'relative' }}>
            <Table columns="2fr 1fr 1fr " rowWidth="100rem">
                <Table.Header>
                    <div>Name</div>
                    <div>Country</div>
                    <div>ID</div>
                </Table.Header>
                <Table.Body
                    data={manufacturers}
                    render={(manufacturer) => (
                        <ManufacturerRow manufacturerData={manufacturer} key={manufacturer.id} />
                    )}
                />
            </Table>
            {isFetchingNextPage && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'transparent' }}>
                    <Spinner />
                </div>
            )}
            {!hasNextPage && manufacturers.length > 0 && (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No more manufacturers to load.</p>
            )}
            {manufacturers.length === 0 && !isLoading && (
                <p style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>No manufacturers found matching your criteria.</p>
            )}
        </div>
    );
}

export default ManufacturerTable; 