import { useCallback, useEffect } from "react";
import Table from "../../../ui/Table";
import Spinner from "../../../ui/Spinner";
import PortalCallRow from "./PortalCallRow";

function PortalCallsTable({ 
    data, 
    isLoading, 
    containerRef,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage 
}) {
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


    if (isLoading && !data?.length) {
        return <Spinner type="fullPage" />;
    }

    if (!data?.length) {
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
        <>
            <Table
                columns="1fr 1fr 1fr 1fr 1fr 1.2fr 1.2fr 1fr 0.8fr 1fr "
                rowWidth="180rem"
                transparent={true}
                hasShadow={true}
                hasBorder={true}
            >
                <Table.Header className="tableHeader">
                    <div style={{paddingLeft: '0.5rem'}}>Call Time</div>
                    <div style={{textAlign: 'center'}}>Status</div>
                    <div >Agent</div>
                    <div >Property Info</div>
                    <div >Caller</div>
                    <div  >Receiver</div>
                    <div style={{paddingLeft: '0.5rem'}} >Recording</div>
                    <div >Duration</div>
                    <div >Portal</div>
                    <div >Action</div>
                </Table.Header>
                <Table.Body
                    data={data}
                    render={(portalCallObj) => (
                        <PortalCallRow
                            portalCallData={portalCallObj}
                            key={portalCallObj.id}
                        />
                    )}
                />
            </Table>
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
        </>
    );
}

export default PortalCallsTable;
