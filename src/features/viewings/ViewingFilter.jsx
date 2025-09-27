import Filter from "../../ui/Filter";
import {  STATUS_OPTIONS } from "../../utils/constants";
import useStaff from "../admin/staff/useStaff";
import { usePropertiesBasics } from "../properties/usePropertiesBasics";

const defaultValues = {
    viewing_id: "",
    property_id: "",
    lead_id: "",
    agent_id: "",
    status: "",
    date_from: "",
    date_to: "",
};

function ViewingFilter() {
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });
    const { properties, isLoading: isPropertiesLoading } = usePropertiesBasics(true);

    const propertyOptions = properties.map((property) => ({
        value: property.id,
        label: property.title,
    }));
    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters agentOptions={agentOptions} isAgentLoading={isAgentLoading} propertyOptions={propertyOptions} isPropertiesLoading={isPropertiesLoading} />
        </Filter>
    );
}

function ExtraFilters({ agentOptions, isAgentLoading, propertyOptions, isPropertiesLoading,  }) {
    return (
        <>
         <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
            />
           
            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />
            <Filter.InputDataList
                registerName="status"
                placeholder="Status"
                data={STATUS_OPTIONS}
            />
           <Filter.InputDataList
                registerName="property_id"
                placeholder="Property"
                data={propertyOptions}
                isLoading={isPropertiesLoading}
            />
        </>
    );
}

export default ViewingFilter;
