import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import DeveloperRow from "./DeveloperRow"; // Import Row component
import useInfiniteDevelopers from "./useInfiniteDevelopers";

function DeveloperTable({ containerRef }) {
    const { 
        isLoading, 
        developers, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteDevelopers();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // Infinite scroll logic
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

    if (isLoading && developers.length === 0) return <Spinner type="fullPage" />;
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>Error loading developers.</p>;
    
    return (
        <div style={{ position: 'relative' }}>
            <Table columns="0.5fr 2fr 1fr 0.5fr 0.5fr 0.5fr 0.5fr 1fr" rowWidth="120rem"> {/* Added Pool Project column */}
                <Table.Header>
                    <div>Logo</div>
                    <div>Name</div>
                    <div>Agent</div>
                    <div style={{ textAlign: 'center' }}>Sell</div>
                    <div style={{ textAlign: 'center' }}>Rent</div>
                    <div style={{ textAlign: 'center' }}>Project</div>
                    <div style={{ textAlign: 'center' }}>Pool Project</div>
                    <div style={{ textAlign: 'center' }}>Actions</div>
                </Table.Header>
                <Table.Body
                    data={developers}
                    render={(developer) => (
                        <DeveloperRow developerData={developer} key={developer.id} />
                    )}
                />
            </Table>
            {isFetchingNextPage && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'transparent' }}>
                    <Spinner />
                </div>
            )}
            {!hasNextPage && developers.length > 0 && (
                 <p style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No more developers to load.</p>
             )}
             {developers.length === 0 && !isLoading && (
                 <p style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>No developers found matching your criteria.</p>
             )}
        </div>
    );
}

export default DeveloperTable; 