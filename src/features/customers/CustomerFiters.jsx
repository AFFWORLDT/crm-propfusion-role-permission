import Filter from "../../ui/Filter";
import Modal from "../../ui/Modal";
import useBrowserWidth from "../../hooks/useBrowserWidth";
import useStaff from "../admin/staff/useStaff";
import useAreas from "../areas/useAreas";

const defaultValues = {
    project_name: "",
    agent_id: "",
    area_id: ""
};

function CustomerFilters() {
    const browserWidth = useBrowserWidth();
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const { data: areasData, isLoading: isAreasLoading } = useAreas();

    const agentOptions = agentData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    const areaOptions = areasData?.map((item) => {
        return { value: item.id, label: item.name }; 
    });

    return (
        <Filter defaultValues={defaultValues}>
            <Filter.Input registerName="project_name" placeholder="Project Name" />
            {browserWidth > 480 ? (
                <ExtraFilters
                    agentOptions={agentOptions}
                    areaOptions={areaOptions}
                    isAgentLoading={isAgentLoading}
                    isAreasLoading={isAreasLoading}
                />
            ) : (
                <Modal>
                    <Modal.Open openWindowName="customerFilterModal">
                        <button className="btnExtraFilters">
                            <img src="/icons/filter.svg" alt="" />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="customerFilterModal">
                        <div className="filterModalContainer">
                            <ExtraFilters
                                agentOptions={agentOptions}
                                areaOptions={areaOptions}
                                isAgentLoading={isAgentLoading}
                                isAreasLoading={isAreasLoading}
                            />
                        </div>
                    </Modal.Window>
                </Modal>
            )}
        </Filter>
    );
}

function ExtraFilters({
    agentOptions,
    areaOptions,
    isAgentLoading,
    isAreasLoading
}) {
    return (
        <>
            <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
            />

            <Filter.InputDataList
                registerName="area_id"
                placeholder="Area"
                data={areaOptions}
                isLoading={isAreasLoading}
            />
        </>
    );
}

export default CustomerFilters;
