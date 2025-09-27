import { useEffect, useState } from "react";
import { getNewProperties } from "../services/apiProperties";
import PlotMap from "../ui/PlotMap";
import SectionTop from "../ui/SectionTop";
import Spinner from "../ui/Spinner";
import Filter from "../ui/Filter";
import ToggleButton from "../ui/ToggleButton";
import { LayoutGrid, LayoutList, LayoutTemplate, Search } from "lucide-react";
import TabBar from "../ui/TabBar";
import AddButtonToNavigateForms from "../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../ui/ViewToggleButton";
import NewPropertiesFilter from "../features/properties/NewPropertiesFilter";
import useStaff from "../features/admin/staff/useStaff";
import MapSwitcher from "../ui/MapSwitcher";

const PropertiesMapView = () => {
    console.log("PropertiesMapView rendered"); // DEBUG LOG
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [listingType, setListingType] = useState("SELL"); // SELL या RENT
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    const tabs = [
        { id: "SELL", label: "For Sell", bgColor: "#8cc2f8", fontColor: "#fff" },
        { id: "RENT", label: "For Rent", bgColor: "#8cc2f8", fontColor: "#fff" }
    ];

    useEffect(() => {
        console.log("useEffect running", listingType); // DEBUG LOG
        let isMounted = true;
        const fetchAllProperties = async () => {
            try {
                let allProperties = [];
                let page = 1; // हमेशा 1 से शुरू करें
                let size = 50;
                let total = 0;
                let keepGoing = true;
                while (keepGoing) {
                    console.log("Fetching page:", page, "type:", listingType); // DEBUG LOG
                    const data = await getNewProperties({
                        size,
                        page,
                        listing_type: listingType,
                    });
                    allProperties.push(...(data.properties || []));
                    total = data.totalProperties;
                    if (
                        allProperties.length >= total ||
                        (data.properties || []).length === 0
                    )
                        keepGoing = false;
                    else page++;
                }
                if (isMounted) {
                    setProperties(allProperties);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError("प्रॉपर्टीज़ लोड नहीं हो पाईं।");
                    setLoading(false);
                }
            }
        };
        setLoading(true);
        fetchAllProperties();
        return () => {
            isMounted = false;
        };
    }, [listingType]);

    // PlotMap को सही फॉर्मेट में डेटा दें
    const addresses = properties
        .filter(
            (p) => p.location && p.location.latitude && p.location.longitude
        )
        .map((p) => ({
            ...p,
            position: `${p.location.latitude},${p.location.longitude}`,
            name: p.title || p.location.property_name || p.location.community,
            description: `${p.location.city || ""}${p.location.community ? ", " + p.location.community : ""}${p.location.sub_community ? ", " + p.location.sub_community : ""}`,
            price: p.price,
            photo: p.photos?.[0],
            agentIcon: p.agent?.avatar || null,
        }));
    if (loading) {
        return (
            <div>
                <Spinner type={"fullPage"} />
            </div>
        );
    }
    if (error) {
        return <div style={{ textAlign: "center", color: "red" }}>{error}</div>;
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading={"Properties Map View"}>
                <TabBar
                    tabs={tabs}
                    activeTab={listingType}
                    onTabClick={setListingType}
                    containerStyles={{ marginTop: "1rem" }}
                />
            </SectionTop>
            <section className="sectionStyles">
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <Filter
                                showReset={false}
                                smallHandleResetBtn={true}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                    }}
                                >
                                    <Filter.Input
                                        registerName="title"
                                        placeholder="Name"
                                    />
                                    <Filter.InputDataList
                                        registerName="agent_id"
                                        placeholder="Agent"
                                        data={agentOptions}
                                        isLoading={isAgentLoading}
                                    />
                                </div>
                            </Filter>
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
                            <NewPropertiesFilter />
                        </div>
                    </ToggleButton.Content>
                </ToggleButton>

                {loading && (
                    <div style={{ textAlign: "center" }}>Loading...</div>
                )}
                {error && (
                    <div style={{ textAlign: "center", color: "red" }}>
                        {error}
                    </div>
                )}
                {!loading && !error && (
                    <MapSwitcher
                        listingType={listingType}
                        addresses={addresses}
                        initialHeight={700}
                    />
                )}
            </section>
        </div>
    );
};

export default PropertiesMapView;
