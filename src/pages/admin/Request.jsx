import { Search } from "lucide-react";
import RequestFilter from "../../features/admin/requests/RequestFilter";
import RequestList from "../../features/admin/requests/RequestList";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import ToggleButton from "../../ui/ToggleButton";
import useInfinitePortalRequest from "../../features/admin/requests/useInfinitePortalRequest";

function Request() {
    const {
        requests,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage, 
        isFetchingNextPage,
        totalSize,
    } = useInfinitePortalRequest();

    return (
        <div className="sectionContainer">
            <SectionTop heading="Requests">
                <TabBar
                    tabs={[
                        {
                            id: "REQUESTS",
                            label: "Requests",
                            bgColor: "#f0fff0",
                            fontColor: "#66b366",
                            path: "/admin/requests",
                        },
                    ]}
                    activeTab={"REQUESTS"}
                    navigateTo={() => `/admin/requests`}
                />
            </SectionTop>
            <section
                className="sectionStyles"
                style={{
                    backgroundColor: "#f0fff0",
                    position: "relative",
                    height: requests.length > 0 ? "100vh" : "auto",
                }}
            >
                <div className="sectionDiv">
                    <ToggleButton>
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
                        <ToggleButton.Content>
                            <div
                                className="LEADSfilter"
                                style={{
                                    padding: "1.5rem",
                                    borderTop: "1px solid #eee",
                                    backgroundColor: "transparent",
                                    marginTop: "1rem",
                                }}
                            >
                                <RequestFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>
                    <RequestList
                        data={requests}
                        isPending={isLoading}
                        error={error}
                        isFetchingNextPage={isFetchingNextPage}
                        totalSize={totalSize}
                        onLoadMore={fetchNextPage}
                        hasNextPage={hasNextPage}
                    />
                </div>
            </section>
        </div>
    );
}

export default Request;
