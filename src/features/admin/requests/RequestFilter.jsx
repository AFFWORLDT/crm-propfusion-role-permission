import Filter from "../../../ui/Filter";
import { PORTAL_OPTIONS } from "../../../utils/constants";
import { usePropertiesBasics } from "../../properties/usePropertiesBasics";
import useStaff from "../staff/useStaff";

const statusStyles = {
    pending: { backgroundColor: "#FFF3CD", color: "#856404" },
    approve: { backgroundColor: "#D4EDDA", color: "#155724" },
    disapproved: { backgroundColor: "#F8D7DA", color: "#721C24" }
};

export default function RequestFilter() {
    const { properties, isLoading: isPropertiesLoading } = usePropertiesBasics(true);
    const propertyOptions = properties.map((property) => ({
        value: property.id,
        label: property.title,
    }));


    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const agentOptions = agentData?.map((agent) => ({
        value: agent.id,
        label: agent.name,
    }));


    return (
        <Filter>
            <Filter.InputDataList
                registerName="portal_name"
                placeholder="Select Portal"
                data={PORTAL_OPTIONS}
            />
            <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent id"
                data={agentOptions}
                isLoading={isAgentLoading}
            />
            <Filter.InputDataList
                registerName="property_id"
                placeholder="Property id"
                data={propertyOptions}
                isLoading={isPropertiesLoading}
            />
            <Filter.InputSelect
                options={[
                    { 
                        value: "pending", 
                        label: "Pending",
                        style: statusStyles.pending
                    },
                    { 
                        value: "approve", 
                        label: "Approved",
                        style: statusStyles.approve
                    },
                    { 
                        value: "disapproved", 
                        label: "Rejected",
                        style: statusStyles.disapproved
                    },
                ]}
                registerName="status"
                placeholder="Status"
            />

        </Filter>
    );
}
