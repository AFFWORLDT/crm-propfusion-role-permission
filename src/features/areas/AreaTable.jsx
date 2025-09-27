import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table"; // Assuming a reusable Table component exists
import AreaRow from "./AreaRow"; // Component for each table row
import useInfiniteAreas from "./useInfiniteAreas";

function AreaTable({ containerRef }) {
    const { 
        isLoading, 
        areas, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteAreas();

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

    if (isLoading && areas.length === 0) return <Spinner type="fullPage" />;
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>Error loading areas.</p>;
    
    return (
        <div style={{ position: 'relative' }}>
            <Table columns="2fr 1fr 0.5fr 0.5fr 0.5fr 1fr 0.5fr"> {/* Adjust columns as needed */}
                <Table.Header>
                    <div>Name</div>
                    <div>Agent</div>
                    <div >Sell</div>
                    <div >Rent</div>
                    <div >Project</div>
                    <div >Pool Projects</div>
                        <div >Actions</div> {/* Placeholder for actions */}
                </Table.Header>
                <Table.Body
                    data={areas}
                    render={(area) => (
                        <AreaRow areaData={area} key={area.id} />
                    )}
                />
            </Table>
            {isFetchingNextPage && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'transparent' }}>
                    <Spinner />
                </div>
            )}
            {!hasNextPage && areas.length > 0 && (
                 <p style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No more areas to load.</p>
             )}
             {areas.length === 0 && !isLoading && (
                 <p style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>No areas found matching your criteria.</p>
             )}
        </div>
    );
}

export default AreaTable; 