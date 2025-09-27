import { BEDROOM_NUM_OPTIONS, PROPERTY_TYPES, } from "../../utils/constants";
import Filter from "../../ui/Filter";
// import useBrowserWidth from "../../hooks/useBrowserWidth";
// import Modal from "../../ui/Modal";
import useAreasWithoutCount from "../areas/useAreasWithoutCount";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";
import useStaff from "../admin/staff/useStaff";
import { useEffect, useState } from "react";
import { getBuildNameList } from "../../services/apiBuilding";
import { useGetOwnerLists } from "../Owner/useGetOwnerLists";
import { usePropertiesBasics } from "../properties/usePropertiesBasics";


const defaultValues = {
    building_name: "",
    date_from: "",
    date_to: "",
    property_id: "",
    units_type: "",
    area_id: "",
    developer_id: "",
    bedrooms: "",
    agent_id: "",
    portal: [],
    min_price: "",
    max_price: "",
    building_id: "",
    owner_id: "",
    sort_by_date: "",
    days_until_due: "",
    overdue: false,
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
                const options = data.map(item => ({
                    label: item.building_name,
                    value: item.id,
                }));
                setBuildings([{ label: "Select Building", value: "" }, ...options]);
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

function BuildingFilters () {
    // const browserWidth = useBrowserWidth();
    const { isLoading: isDeveloperLoading, data: developerData } =
        useDevelopersWithoutCount(true);
    const { data: areaData, isLoading: isAreaLoading } =
        useAreasWithoutCount(true);
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const { buildings, isLoading: isBuildingLoading } = useBuildings();
    const { data: ownerData, isLoading: isOwnerLoading } = useGetOwnerLists();
    const { properties,loading } = usePropertiesBasics(true);

    const propertyOptions = properties?.map((data) => {
        return {
            value: data?.id,
            label: data?.title,
        };
    });
    const ownerOptions = ownerData?.map((data) => {
        return {
            value: data?.id,
            label: data?.owner_name,
        };
    });

    const developerOptions = developerData.map((data) => {
        return {
            value: data.id,
            label: data.name,
        };
    });
    const areaOptions = areaData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });


    return (
        <Filter defaultValues={defaultValues}>

            <ExtraFilters
                developerOptions={developerOptions}
                isDeveloperLoading={isDeveloperLoading}
                areaOptions={areaOptions}
                isAreaLoading={isAreaLoading}
                agentOptions={agentOptions}
                isAgentLoading={isAgentLoading}
                buildings={buildings}
                isBuildingLoading={isBuildingLoading}
                ownerOptions={ownerOptions}
                isOwnerLoading={isOwnerLoading}
                propertyOptions={propertyOptions}
                isPropertyLoading={loading}
            />
        </Filter>
    );
}

function ExtraFilters({
    buildings,
    isBuildingLoading,
    ownerOptions,
    isOwnerLoading,
    propertyOptions,
    isPropertyLoading,
}) {
    return (
        <>
            <Filter.Input registerName="building_name" placeholder="Name" />

            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />
          
            
            <Filter.InputSelect
                registerName="units_type"
                options={PROPERTY_TYPES}

            />
           
            <Filter.InputDataList
                registerName="owner_id"
                placeholder="Owner"
                data={ownerOptions}
                isLoading={isOwnerLoading}
            />
            <Filter.InputDataList
                registerName="property_id"
                placeholder="Property"
                data={propertyOptions}
                isLoading={isPropertyLoading}
            />
            <Filter.InputSelect
                registerName="bedrooms"
                options={BEDROOM_NUM_OPTIONS}
            />
            <Filter.InputDataList
                registerName="building_id"
                placeholder="Building Name"
                data={buildings}
                isLoading={isBuildingLoading}
            />
            <Filter.Input
                registerName="days_until_due"
                placeholder="Days Until Due"
            />
            <Filter.InputDataList
                registerName="overdue"
                label="Overdue Payments"
                data={[
                    { value: true, label: "Overdue" },
                    { value: false, label: "Not Overdue" },
                ]}
                placeholder="Overdue Payments"
            />
        </>
    );
}

export default BuildingFilters;
