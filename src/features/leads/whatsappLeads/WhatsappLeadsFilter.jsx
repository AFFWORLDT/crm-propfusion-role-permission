import { PORTAL_OPTIONS_FOR_WHATSAPP_LEAD } from "../../../utils/constants";
import Filter from "../../../ui/Filter";
import useStaff from "../../admin/staff/useStaff";

const defaultValues = {
    title: "",
    date_from: "",
    date_to: "",
    propertyId: "",
    lead_id: "",
    bedrooms: "",
    agent_Id: "",
    portal: [],
    property_id: ""
};

function WhatsappLeadsFilter() {

    const { data: agentData, isLoading: isAgentLoading } = useStaff()



    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    return (
        <Filter defaultValues={defaultValues}>

            <ExtraFilters

                agentOptions={agentOptions}
                isAgentLoading={isAgentLoading}
            />

        </Filter>
    );
}

function ExtraFilters({
    isDeveloperLoading,
    agentOptions,
    isAgentLoading,
}) {
    return (
        <>
            <Filter.Input registerName="lead_id" placeholder="Lead ID" />

            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />


            <Filter.Input
                registerName="propertyId"
                placeholder="Reference ID"
            />
            <Filter.Input
                registerName="property_id"
                placeholder="Property ID"
            />
            <Filter.Input
                registerName="cell"
                placeholder="Cell"
            />


            <Filter.InputDataList
                registerName="agent_Id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
            />

            <Filter.InputDataList
                registerName="portal"
                placeholder="Portal"
                data={PORTAL_OPTIONS_FOR_WHATSAPP_LEAD || []}
                isLoading={isDeveloperLoading}
                isMulti
            />
        </>
    );
}

export default WhatsappLeadsFilter;
