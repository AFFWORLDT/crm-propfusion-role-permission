import Filter from "../../ui/Filter";
import useStaff from "../admin/staff/useStaff";

const defaultValues = {
    agent_id: "",
    start_date: "",
    end_date: "",
};

function KpiSubmissionFilter() {
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

  
    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters agentOptions={agentOptions} isAgentLoading={isAgentLoading}/>
        </Filter>
    );
}

function ExtraFilters({ agentOptions, isAgentLoading  }) {
    return (
        <>
         {/* <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
                isMulti
            /> */}
           
            <Filter.InputDatePicker
                registerName="start_date"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="end_date"
                placeholder="End date"
            />
          
          
        </>
    );
}

export default KpiSubmissionFilter
