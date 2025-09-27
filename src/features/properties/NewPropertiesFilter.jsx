import {
    BEDROOM_NUM_OPTIONS,
    PORTAL_OPTIONS,
    PROPERTY_TYPES_GROUPS_OPTION,
    COMPLETION_STATUS_OPTIONS,
    PRICE_TYPE_OPTIONS,
} from "../../utils/constants";
import Filter from "../../ui/Filter";
import useBrowserWidth from "../../hooks/useBrowserWidth";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import useStaff from "../admin/staff/useStaff";
// import useOwner from "../Owner/useOwner";
import useInfiniteOwners from "../Owner/useInfiniteOwners";
import { useEffect, useState } from "react";
import { getBuildNameList } from "../../services/apiBuilding";
import { getDevelopersFlters } from "../../services/apiDevelopers";
import { formateDevelopersOptions } from "../../utils/utils";
import { getLocation } from "../../services/apiLocations";
import { formatLocationsCommunityOptionsForProperties } from "../../utils/utils";
import { useSearchParams } from "react-router-dom";

const defaultValues = {
    title: "",
    date_from: "",
    date_to: "",
    property_id: "",
    property_type: "",
    area_id: "",
    developer_id: "",
    bedrooms: "",
    agent_id: "",
    portal: [],
    min_price: "",
    max_price: "",
    owner_id: "",
    completion_status: "",
    building_id: "",
    houseno: "",
    community: "",
};

function useBuildings() {
    const [buildings, setBuildings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBuildings() {
            try {
                setIsLoading(true);
                const data = await getBuildNameList();
                const options = data.map((item) => ({
                    label: item.building_name,
                    value: item.id,
                }));
                setBuildings([
                    { label: "Select Building", value: "" },
                    ...options,
                ]);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }

        fetchBuildings();
    }, []);

    return { buildings, isLoading, error };
}

function NewPropertiesFilter({ localListingType, onFilterResults }) {
    const browserWidth = useBrowserWidth();
    // const [searchParams, setSearchParams] = useSearchParams();
    // const { isLoading: isDeveloperLoading, data: developerData } =
    //     useDevelopersWithoutCount(true);
    // const { data: areaData, isLoading: isAreaLoading } =
    //     useAreasWithoutCount(true);
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const { buildings, isLoading: isBuildingLoading } = useBuildings();
    // const {
    //     data: Owner,
    //     isLoading: isOwnerLoading,
    //     isError: isOwnerError,
    // } = useOwner();

    const {
        owners: Owner,
        isLoading: isOwnerLoading,
        isError: isOwnerError,
    } = useInfiniteOwners("", true);
    const ownersOption = Owner?.map((data) => {
        return {
            value: data?.id,
            label: data?.owner_name,
        };
    });

    // const developerOptions = developerData.map((data) => {
    //     return {
    //         value: data.id,
    //         label: data.name,
    //     };
    // });
    // const areaOptions = areaData.map((item) => {
    //     return { value: item.id, label: item.name };
    // });
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    // // Check if building_id is in URL params and apply filter on initial load
    // useEffect(() => {
    //     const buildingIdParam = searchParams.get('building_id');
    //     if (buildingIdParam) {
    //         fetchPropertiesByBuildingId(buildingIdParam);
    //     }
    // }, [searchParams]);

    // const fetchPropertiesByBuildingId = async (buildingId) => {
    //     try {
    //         const properties = await getNewPropertiesByBuildingId(buildingId);
    //         // Pass filter results to parent component
    //         if (onFilterResults) {
    //             onFilterResults(properties);
    //         }
    //         return properties;
    //     } catch (error) {
    //         console.error("Error fetching properties by building ID:", error);
    //         // Reset filter in case of error
    //         if (onFilterResults) {
    //             onFilterResults(null);
    //         }
    //         return null;
    //     }
    // };

    // const handleFilterChange = async (values) => {
    //     if (values.building_id) {
    //         try {
    //             // Update the URL with the building_id parameter
    //             setSearchParams((prev) => {
    //                 const newParams = new URLSearchParams(prev);
    //                 newParams.set("building_id", values.building_id);
    //                 return newParams;
    //             });

    //             // Filter properties by building ID
    //             return await fetchPropertiesByBuildingId(values.building_id);
    //         } catch (error) {
    //             console.error("Error filtering properties by building ID:", error);
    //         }
    //     } else {
    //         // If building_id is empty, clear the filter
    //         setSearchParams((prev) => {
    //             const newParams = new URLSearchParams(prev);
    //             newParams.delete("building_id");
    //             return newParams;
    //         });

    //         // Pass null to reset filter
    //         if (onFilterResults) {
    //             onFilterResults(null);
    //         }
    //     }
    // };

    return (
        <Filter defaultValues={defaultValues}>
            {browserWidth > 480 ? (
                <ExtraFilters
                    // developerOptions={developerOptions}
                    // isDeveloperLoading={isDeveloperLoading}
                    // areaOptions={areaOptions}
                    // isAreaLoading={isAreaLoading}
                    agentOptions={agentOptions}
                    isAgentLoading={isAgentLoading}
                    ownersOption={ownersOption}
                    isOwnerLoading={isOwnerLoading}
                    isOwnerError={isOwnerError}
                    buildings={buildings}
                    isBuildingLoading={isBuildingLoading}
                    localListingType={localListingType}
                />
            ) : (
                <div className="filterModalContainer">
                    <ExtraFilters
                        // developerOptions={developerOptions}
                        // isDeveloperLoading={isDeveloperLoading}
                        // areaOptions={areaOptions}
                        // isAreaLoading={isAreaLoading}
                        agentOptions={agentOptions}
                        isAgentLoading={isAgentLoading}
                        ownersOption={ownersOption}
                        isOwnerLoading={isOwnerLoading}
                        isOwnerError={isOwnerError}
                        buildings={buildings}
                        isBuildingLoading={isBuildingLoading}
                        localListingType={localListingType}
                    />
                </div>
            )}
        </Filter>
    );
}

function ExtraFilters({
    // developerOptions,
    // isDeveloperLoading,
    // areaOptions,
    agentOptions,
    isAgentLoading,
    // isAreaLoading,
    ownersOption,
    isOwnerLoading,
    buildings,
    isBuildingLoading,
    localListingType,
}) {
    const [searchParams] = useSearchParams();
    const city = searchParams.get("city");
    const community = searchParams.get("community");
    return (
        <>
            <Filter.Input registerName="title" placeholder="Name" />
            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />
            <Filter.Input
                registerName="property_id"
                placeholder="Property ID"
            />
            <Filter.Input
                registerName="min_price"
                placeholder="Min price"
                type="number"
            />{" "}
            <Filter.Input
                registerName="max_price"
                placeholder="Max price"
                type="number"
            />
            {localListingType === "RENT" && (
                <Filter.InputDataList
                    registerName="price_type"
                    placeholder="Price Type"
                    data={PRICE_TYPE_OPTIONS}
                />
            )}
            <Filter.InputDataList
                registerName="property_type"
                placeholder="Property Type"
                data={PROPERTY_TYPES_GROUPS_OPTION}
                isMulti
            />
            {/* <Filter.InputDataList
                registerName="area_id"
                placeholder="Area"
                data={areaOptions}
                isLoading={isAreaLoading}
            /> */}
            <Filter.InputDataList
                registerName={"owner_id"}
                placeholder={"Owner"}
                data={ownersOption || []}
                isLoading={isOwnerLoading}
            />
            {/* <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
            /> */}
            <Filter.InputAsyncDataList
                registerName="developer_id"
                placeholder="Developer"
                asyncFunc={(search) => getDevelopersFlters(search)}
                formatFunc={formateDevelopersOptions}
            />
            {/* <Filter.InputDataList
                registerName="developer_id"
                placeholder="Developer"
                data={developerOptions}
                isLoading={isDeveloperLoading}
            /> */}
            <Filter.InputDataList
                registerName="building_id"
                placeholder="Building Name"
                data={buildings}
                isLoading={isBuildingLoading}
            />
            <Filter.Input registerName="houseno" placeholder="House Number" />
            <Filter.InputDataList
                registerName="portal"
                placeholder="Portal"
                data={PORTAL_OPTIONS || []}
                isMulti
            />
            {localListingType === "SELL" && (
                <Filter.InputDataList
                    registerName="completion_status"
                    placeholder="completion status"
                    data={COMPLETION_STATUS_OPTIONS}
                />
            )}
            <Filter.InputDataList
                registerName="bedrooms"
                placeholder={"Bedroom"}
                data={BEDROOM_NUM_OPTIONS}
            />
            <Filter.InputAsyncDataList
                registerName="city"
                placeholder="city"
                asyncFunc={(search) => getLocation("city", search)}
                formatFunc={formatLocationsCommunityOptionsForProperties}
            />
            {city !== null && (
                <Filter.InputAsyncDataList
                    registerName="community"
                    placeholder="community"
                    asyncFunc={(search) =>
                        getLocation("community", search, city)
                    }
                    formatFunc={formatLocationsCommunityOptionsForProperties}
                />
            )}
            {city !== null && community !== null && (
                <Filter.InputAsyncDataList
                    registerName="subcommunity"
                    placeholder="subcommunity"
                    asyncFunc={(search) =>
                        getLocation("sub_community", search, city, community)
                    }
                    formatFunc={formatLocationsCommunityOptionsForProperties}
                />
            )}
        </>
    );
}

export default NewPropertiesFilter;
