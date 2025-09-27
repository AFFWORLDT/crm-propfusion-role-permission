import styles from "../../../styles/ListingItem.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import PageNotFound from "../../PageNotFound";
import SectionTop from "../../../ui/SectionTop";
import useNewProperty from "../../../features/properties/useNewProperty";
import NewPropertyTop from "../../../features/properties/NewPropertyTop";
import { bedroomString, dateToYMD } from "../../../utils/utils";
import FollowUps from "../../../features/followUps/FollowUps";
import AgentContact from "../../../ui/AgentContact";
import useUpdateProperty from "../../../features/properties/useUpdateProperty";
import useStaff from "../../../features/admin/staff/useStaff";
import usePropertyLogs from "../../../features/properties/usePropertyLogs";
import LeadLogs from "../../leads/Logs";
import PropertyLeades from "../../leads/GetLeades";
import WhatsappLeads from "../../leads/GetWhatsappLeads";
import {
    Building2,
    Calendar,
    Car,
    CheckCircle2,
    Clock,
    CreditCard,
    Bath,
    Bed,
    Key,
    Layers,
    MapPin,
    Ruler,
    Scale,
    User,
    Wallet,
    Watch,
} from "lucide-react";
import ViewingList from "../../../features/viewings/ViewingList";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../../config/googleMaps";

function NewSellProperty() {
    const { data, isLoading, error } = useNewProperty();
    const { changeProperty, isPending } = useUpdateProperty();
    const { data: propertyFinderAgentData } = useStaff(
        data[0]?.propertyFinder_agent_Id
    );
    const { data: propfusionAgentData } = useStaff(
        data[0]?.propfusionPortal_agent_Id
    );
    const { data: ownPortalAgentData } = useStaff(data[0]?.ownPortal_agent_Id);
    const { data: bayutDubizzleAgentData } = useStaff(
        data[0]?.bayut_dubizzle_agent_Id
    );
    const {
        propertyLogsData,
        isLoading: logsLoading,
        error: logsError,
    } = usePropertyLogs();

    // Google Maps loading
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    function handleChangeAgent(agentType, agentId, onCloseModal) {
        const updatedFields = {
            propertyFinder_agent_Id:
                agentType === "propertyFinder"
                    ? agentId
                    : data[0].propertyFinder_agent_Id,
            propfusionPortal_agent_Id:
                agentType === "propfusion"
                    ? agentId
                    : data[0].propfusionPortal_agent_Id,
            ownPortal_agent_Id:
                agentType === "ownPortal"
                    ? agentId
                    : data[0].ownPortal_agent_Id,
            bayut_dubizzle_agent_Id:
                agentType === "bayutDubizzle"
                    ? agentId
                    : data[0].bayut_dubizzle_agent_Id,
        };

        changeProperty(
            {
                id: data[0].id,
                updatedProperty: { ...data[0], ...updatedFields },
            },
            {
                onSettled: onCloseModal,
            }
        );
    }

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        if (logsError) toast.error(logsError.message);
    }, [logsError]);

    if (isLoading || logsLoading) return <Spinner type="fullPage" />;
    if (data.length === 0) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="New Sell Detail" />

            <section className="sectionStyles">
                <div className={styles.listingItem}>
                    <NewPropertyTop data={data[0]} />

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.details}`}>
                            <h3>
                                <Building2 size={20} />
                                <span>Details</span>
                            </h3>
                            <ul>
                                {[
                                    {
                                        label: "ID",
                                        value: data[0]?.id,
                                        icon: <Key size={16} />,
                                    },
                                    ...(data[0]?.building_info?.id
                                        ? [
                                              {
                                                  label: "Building ID",
                                                  value: data[0]?.building_info
                                                      ?.id,
                                                  icon: <MapPin size={16} />,
                                              },
                                          ]
                                        : []),
                                    ...(data[0]?.building_info?.building_name
                                        ? [
                                              {
                                                  label: "Building Name",
                                                  value: data[0]?.building_info
                                                      ?.building_name,
                                                  icon: <MapPin size={16} />,
                                              },
                                          ]
                                        : []),
                                    {
                                        label: "Completion status",
                                        value:
                                            data[0]?.completionStatus || "N/A",
                                        icon: <CheckCircle2 size={16} />,
                                    },
                                    {
                                        label: "Size",
                                        value: `${data[0]?.size || "N/A"} sq.ft`,
                                        icon: <Ruler size={16} />,
                                    },
                                    {
                                        label: "Plot Size",
                                        value: data[0]?.plotSize || "N/A",
                                        icon: <Ruler size={16} />,
                                    },
                                    {
                                        label: "Bedrooms",
                                        value: bedroomString(data[0].bedRooms),
                                        icon: <Bed size={16} />,
                                    },
                                    {
                                        label: "Bathrooms",
                                        value: data[0].bathrooms || "N/A",
                                        icon: <Bath size={16} />,
                                    },
                                    {
                                        label: "Total Floor",
                                        value: data[0].totalFloor || "N/A",
                                        icon: <Layers size={16} />,
                                    },
                                    {
                                        label: "Year Built",
                                        value: data[0].buildYear || "N/A",
                                        icon: <Calendar size={16} />,
                                    },
                                    {
                                        label: "Occupancy",
                                        value: data[0].occupancy || "N/A",
                                        icon: <User size={16} />,
                                    },
                                    {
                                        label: "Parking",
                                        value: data[0].parking || "N/A",
                                        icon: <Car size={16} />,
                                    },
                                    {
                                        label: "Furniture",
                                        value: data[0].isFurnished || "N/A",
                                        icon: <CheckCircle2 size={16} />,
                                    },
                                    {
                                        label: "Service Charge",
                                        value: data[0].serviceCharge || "N/A",
                                        icon: <Wallet size={16} />,
                                    },
                                    {
                                        label: "AC Charge",
                                        value: data[0].acCharge || "N/A",
                                        icon: <Wallet size={16} />,
                                    },
                                    {
                                        label: "Mortgage",
                                        value: data[0].hasMortgage || "N/A",
                                        icon: <CreditCard size={16} />,
                                    },
                                    {
                                        label: "Permit Number",
                                        value: data[0].permitNumber || "N/A",
                                        icon: <Key size={16} />,
                                    },
                                    {
                                        label: "Listed By",
                                        value:
                                            data[0]?.created_by_agent?.name ||
                                            "N/A",
                                        icon: <User size={16} />,
                                    },
                                    {
                                        label: "Ref Id",
                                        value: data[0]?.propertyId || "N/A",
                                        icon: <Key size={16} />,
                                    },
                                    ...(data[0]?.bayut_reference_id &&
                                    data[0]?.bayut_reference_id !== null &&
                                    data[0]?.bayut_reference_id !== ""
                                        ? [
                                              {
                                                  label: "Bayut Ref Id",
                                                  value: data[0]?.bayut_reference_id,
                                                  icon: <Key size={16} />,
                                              },
                                          ]
                                        : []),
                                    ...(data[0]?.propertyfinder_reference_id &&
                                    data[0]?.propertyfinder_reference_id !== null &&
                                    data[0]?.propertyfinder_reference_id !== ""
                                        ? [
                                              {
                                                  label: "Property Finder Ref Id",
                                                  value: data[0]?.propertyfinder_reference_id,
                                                  icon: <Key size={16} />,
                                              },
                                          ]
                                        : []),
                                    {
                                        label: "Created At",
                                        value:
                                            dateToYMD(data[0]?.createTime) ||
                                            "N/A",
                                        icon: <Clock size={16} />,
                                    },
                                    {
                                        label: "Updated At",
                                        value:
                                            dateToYMD(data[0]?.lastUpdate) ||
                                            "N/A",
                                        icon: <Clock size={16} />,
                                    },
                                    ...(data[0]?.dewa_no &&
                                    data[0]?.dewa_no !== ""
                                        ? [
                                              {
                                                  label: "Dewa no",
                                                  value: data[0]?.dewa_no,
                                                  icon: <Key size={16} />,
                                              },
                                          ]
                                        : []),
                                ].map(({ label, value, icon }, index) => (
                                    <li key={index}>
                                        <span>
                                            {icon} {label}:{" "}
                                        </span>
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <FollowUps
                            type="property"
                            targetId={data[0].id}
                            isForProperty={true}
                            maxWidth={"100%"}
                            maxHeight={"50rem"}
                            height={"50rem"}
                        />
                    </div>
                    <div className={styles.gridContainer}>
                        <div className={styles.listingFlexRow}>
                            <div className={`sectionDiv`}>
                                <h3>
                                    <img
                                        src="/icons/grid.svg"
                                        alt=""
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                        }}
                                    />
                                    <span>Portal Agents</span>
                                </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "3rem",
                                    }}
                                >
                                    <div>
                                        <h4>Bayut & Dubizzle</h4>
                                        <AgentContact
                                            onChangeAgent={(id, onClose) =>
                                                handleChangeAgent(
                                                    "bayutDubizzle",
                                                    id,
                                                    onClose
                                                )
                                            }
                                            isChangingAgent={isPending}
                                            agentAvatar={
                                                bayutDubizzleAgentData?.avatar
                                            }
                                            agentName={
                                                bayutDubizzleAgentData?.name
                                            }
                                            agentPhone={
                                                bayutDubizzleAgentData?.phone
                                            }
                                            agentMail={
                                                bayutDubizzleAgentData?.email
                                            }
                                        />
                                    </div>
                                    <div>
                                        <h4>Property Finder</h4>
                                        <AgentContact
                                            onChangeAgent={(id, onClose) =>
                                                handleChangeAgent(
                                                    "propertyFinder",
                                                    id,
                                                    onClose
                                                )
                                            }
                                            isChangingAgent={isPending}
                                            agentAvatar={
                                                propertyFinderAgentData?.avatar
                                            }
                                            agentName={
                                                propertyFinderAgentData?.name
                                            }
                                            agentPhone={
                                                propertyFinderAgentData?.phone
                                            }
                                            agentMail={
                                                propertyFinderAgentData?.email
                                            }
                                        />
                                    </div>
                                    <div>
                                        <h4>Own Portal</h4>
                                        <AgentContact
                                            onChangeAgent={(id, onClose) =>
                                                handleChangeAgent(
                                                    "ownPortal",
                                                    id,
                                                    onClose
                                                )
                                            }
                                            isChangingAgent={isPending}
                                            agentAvatar={
                                                ownPortalAgentData?.avatar
                                            }
                                            agentName={ownPortalAgentData?.name}
                                            agentPhone={
                                                ownPortalAgentData?.phone
                                            }
                                            agentMail={
                                                ownPortalAgentData?.email
                                            }
                                        />
                                    </div>
                                    <div>
                                        <h4>Prop Fusion</h4>
                                        <AgentContact
                                            onChangeAgent={(id, onClose) =>
                                                handleChangeAgent(
                                                    "propfusion",
                                                    id,
                                                    onClose
                                                )
                                            }
                                            isChangingAgent={isPending}
                                            agentAvatar={
                                                propfusionAgentData?.avatar
                                            }
                                            agentName={
                                                propfusionAgentData?.name
                                            }
                                            agentPhone={
                                                propfusionAgentData?.phone
                                            }
                                            agentMail={
                                                propfusionAgentData?.email
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`sectionDiv`}>
                            <PropertyLeades
                                propertyId={data[0]?.id}
                                type="SELL"
                                title="Property Leads"
                            />
                        </div>
                    </div>

                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.description}`}>
                            {data[0]?.location?.latitude &&
                                data[0]?.location?.longitude && (
                                    <div className={styles.gridContainer}>
                                        <div>
                                            <h3>
                                                <MapPin size={20} />
                                                <span>Property Location</span>
                                            </h3>
                                            <div
                                                className={styles.mapContainer}
                                            >
                                                {loadError && (
                                                    <div className={styles.placeholderMap}>
                                                        <span>Error loading maps: {loadError.message}</span>
                                                    </div>
                                                )}
                                                {!isLoaded && (
                                                    <div className={styles.placeholderMap}>
                                                        <span>Loading Maps...</span>
                                                    </div>
                                                )}
                                                {isLoaded && data[0]?.location?.latitude && data[0]?.location?.longitude && (
                                                    <GoogleMap
                                                        zoom={15}
                                                        center={{
                                                            lat: parseFloat(
                                                                data[0].location
                                                                    .latitude
                                                            ),
                                                            lng: parseFloat(
                                                                data[0].location
                                                                    .longitude
                                                            ),
                                                        }}
                                                        mapContainerStyle={{
                                                            width: "100%",
                                                            height: "500px",
                                                            borderRadius:
                                                                "12px",
                                                        }}
                                                        options={{
                                                            zoomControl: true,
                                                            streetViewControl: true,
                                                            mapTypeControl: true,
                                                            fullscreenControl: true,
                                                            streetViewControlOptions: {
                                                                position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM
                                                            }
                                                        }}
                                                    >
                                                        <MarkerF
                                                            position={{
                                                                lat: parseFloat(
                                                                    data[0].location
                                                                        .latitude
                                                                ),
                                                                lng: parseFloat(
                                                                    data[0].location
                                                                        .longitude
                                                                ),
                                                            }}
                                                        />
                                                    </GoogleMap>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            {/* <div>
                                <WhatsappLeads
                                    propertyId={data[0]?.id}
                                    type="SELL"
                                    title="whatsapp leads"
                                />
                            </div> */}
                        </div>
                        <div>
                            <LeadLogs
                                leadLogs={propertyLogsData}
                                isLoading={logsLoading}
                                isError={logsError}
                                title="Property Logs"
                            />
                        </div>
                    </div>

                    {/* Property Description Section */}
                    <div className={styles.gridContainer}>
                        <div className={`sectionDiv ${styles.description}`}>
                            <div>
                                <h3>
                                    <img src="/icons/document.svg" alt="" />
                                    <span>Description</span>
                                </h3>
                            </div>
                            <p>{data[0].description}</p>
                        </div>
                        <div>
                            <ViewingList propertyId={data[0].id} />
                        </div>
                    </div>

                    {/* Property Location Map */}
                </div>
            </section>
        </div>
    );
}

export default NewSellProperty;
