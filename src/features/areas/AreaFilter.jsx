import Filter from "../../ui/Filter";
import useStaff from "../admin/staff/useStaff";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const defaultValues = {
    search: "",
    city: "",
    agent_id: "",
    sort_by_name: "",
    sort_by_city: "",
    sort_by_total_count: "",
    sort_by_sell_count: "",
    sort_by_project_count: "",
    sort_by_pool_project_count: "",
    sort_by_rent_count: "",
    sort_by: "total_count",
    sort_order: "desc",
};

const sortOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
];

const countTypeOptions = [
    { value: "", label: "None" },
    { value: "name", label: "Name" },
    { value: "city", label: "City" },
    { value: "sell_count", label: "Sell Count" },
    { value: "rent_count", label: "Rent Count" },
    { value: "project_count", label: "Project Count" },
    { value: "pool_project_count", label: "Pool Project Count" },
    { value: "total_count", label: "Total Count" },
];

function AreaFilter() {
    // const [searchParams, setSearchParams] = useSearchParams();
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const { currentUser } = useAuth();

    // useEffect(() => {
    //     if (!searchParams.get('sort_by')) {
    //         searchParams.set('sort_by', 'total_count');
    //         searchParams.set('sort_by_total_count', 'DESC');
    //         setSearchParams(searchParams);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const agentOptions =
        agentData?.map((item) => {
            return { value: item.id, label: item.name };
        }) || [];

    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters
                agentOptions={agentOptions}
                isAgentLoading={isAgentLoading}
            />
        </Filter>
    );
}

function ExtraFilters({ agentOptions, isAgentLoading }) {
    // const [searchParams, setSearchParams] = useSearchParams();

    // const handleSortFieldChange = (e) => {
    //     const newField = e.target.value;
    //     const oldField = searchParams.get('sort_by') || 'total_count';

    //     // Clear all sort parameters
    //     ['name', 'city', 'total_count', 'sell_count', 'project_count', 'pool_project_count', 'rent_count'].forEach(field => {
    //         searchParams.delete(`sort_by_${field}`);
    //     });

    //     if (newField) {
    //         const direction = searchParams.get(`sort_by_${oldField}`) || 'DESC';
    //         searchParams.set('sort_by', newField);
    //         searchParams.set(`sort_by_${newField}`, direction);
    //     } else {
    //         searchParams.delete('sort_by');
    //     }

    //     setSearchParams(searchParams);
    // };

    // const currentSortField = searchParams.get('sort_by') || 'total_count';

    return (
        <>
            <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
                isMulti
            />
            <Filter.Input
                registerName="search community"
                placeholder="Search Community"
            />
            <Filter.Input registerName="city" placeholder="City" />
            <Filter.InputSelect
                registerName="sort_by"
                placeholder="Sort by"
                options={countTypeOptions}
                // onChange={handleSortFieldChange}
            />
            <Filter.InputSelect
                registerName={`sort_order`}
                placeholder="Sort Direction"
                options={sortOptions}
            />
        </>
    );
}

export default AreaFilter;
