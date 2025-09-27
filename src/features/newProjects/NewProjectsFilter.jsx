import {
    BEDROOM_NUM_OPTIONS,
    BUILD_NAME_OPTIONS,
    PORTAL_OPTIONS,
    PROPERTY_TYPES,
    POOL_TYPES,
} from "../../utils/constants";
import Filter from "../../ui/Filter";
// import useBrowserWidth from "../../hooks/useBrowserWidth";
// import Modal from "../../ui/Modal";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import useStaff from "../admin/staff/useStaff";
import { useEffect, useState } from "react";
import { getBuildNameList } from "../../services/apiBuilding";
import { getLocation } from "../../services/apiLocations";
import {
    formateDevelopersOptions,
    formatLocationsCommunityOptionsForProperties,
} from "../../utils/utils";
import { useSearchParams } from "react-router-dom";
import { getDevelopersFlters } from "../../services/apiDevelopers";

const defaultValues = {
    project_name: "",
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
    handover_year: "",
    building_id: "",
    pool_type: "",
    community: "",
    sub_community: "",
    property: "",
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

function NewPropertiesFilter() {
    // const browserWidth = useBrowserWidth();

    // const { isLoading: isDeveloperLoading, data: developerData } =
    //     useDevelopersWithoutCount(true);
    // const { data: areaData, isLoading: isAreaLoading } =
    //     useAreasWithoutCount(true);
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const { buildings, isLoading: isBuildingLoading } = useBuildings();

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

    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters
                // developerOptions={developerOptions}
                // isDeveloperLoading={isDeveloperLoading}
                // areaOptions={areaOptions}
                // isAreaLoading={isAreaLoading}
                agentOptions={agentOptions}
                isAgentLoading={isAgentLoading}
                buildings={buildings}
                isBuildingLoading={isBuildingLoading}
            />
        </Filter>
    );
}

function ExtraFilters({
    // developerOptions,
    // isDeveloperLoading,
    // areaOptions,
    // isAreaLoading,
    buildings,
    isBuildingLoading,
}) {
    const [searchParams] = useSearchParams();
    const city = searchParams.get("city");
    const community = searchParams.get("community");
    const subcommunity = searchParams.get("subcommunity");
    // Add default option to pool types
    const poolTypeOptions = [
        { value: "", label: "Select Pool Type" },
        ...POOL_TYPES,
    ];
    return (
        <>
            <Filter.Input registerName="project_name" placeholder="Name" />
            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />
            <Filter.Input
                registerName="project_id"
                placeholder="Property ID"
                type="number"
            />
            <Filter.Input
                registerName="min_price"
                placeholder="Min Price"
                type="number"
            />{" "}
            <Filter.Input
                registerName="max_price"
                placeholder="Max Price"
                type="number"
            />
            <Filter.InputDataList
                registerName="property_type"
                placeholder={"Property Type"}
                data={PROPERTY_TYPES}
                isLoading={false}
            />
            {/* <Filter.InputDataList
                registerName="area_id"
                placeholder="Area"
                data={areaOptions}
                isLoading={isAreaLoading}
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
                registerName="portals"
                placeholder="Portal"
                data={PORTAL_OPTIONS || []}
                isLoading={false}
                isMulti
            />
            <Filter.InputDataList
                registerName="rooms"
                placeholder="Bedrooms"
                data={BEDROOM_NUM_OPTIONS}
                isLoading={false}
            />
            <Filter.InputDataList
                registerName="pool_type"
                placeholder={"Pool Type"}
                data={poolTypeOptions}
                isLoading={false}
            />
            <Filter.InputDataList
                registerName="building_id"
                placeholder="Building Name"
                data={buildings}
                isLoading={isBuildingLoading}
            />
            <Filter.InputDatePicker
                registerName="handover_year"
                placeholder="Handover Year"
                isYearPicker={true}
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
            {city !== null && community !== null && subcommunity !== null && (
                <Filter.Input
                    registerName="property_name"
                    placeholder="Property Name"
                    type="text"
                />
            )}
        </>
    );
}

export default NewPropertiesFilter;
