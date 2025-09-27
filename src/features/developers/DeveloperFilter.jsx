import Filter from "../../ui/Filter";
import useStaff from "../admin/staff/useStaff";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const defaultValues = {
    name: "",
    agent_id: "",
    sort_by_total_count: "",
    sort_by_sell_count: "",
    sort_by_project_count: "",
    sort_by_rent_count: "",
    sort_field: "total_count"
};

const sortOptions = [
    { value: "", label: "None" },
    { value: "ASC", label: "Ascending" },
    { value: "DESC", label: "Descending" },
];

const countTypeOptions = [
    { value: "", label: "None" },
    { value: "total_count", label: "Total Count" },
    { value: "sell_count", label: "Sell Count" },
    { value: "rent_count", label: "Rent Count" },
    { value: "project_count", label: "Project Count" },
];

function DeveloperFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: agentData, isLoading: isAgentLoading } = useStaff();

    useEffect(() => {
        if (!searchParams.get('sort_field')) {
            searchParams.set('sort_field', 'total_count');
            searchParams.set('sort_by_total_count', 'DESC');
            setSearchParams(searchParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const agentOptions = agentData?.map((item) => {
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
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSortFieldChange = (e) => {
        const newField = e.target.value;
        const oldField = searchParams.get('sort_field') || 'total_count';

        // Clear all sort parameters
        ['total_count', 'sell_count', 'project_count', 'rent_count'].forEach(field => {
            searchParams.delete(`sort_by_${field}`);
        });

        if (newField) {
            const direction = searchParams.get(`sort_by_${oldField}`) || 'DESC';
            searchParams.set('sort_field', newField);
            searchParams.set(`sort_by_${newField}`, direction);
        } else {
            searchParams.delete('sort_field');
        }

        setSearchParams(searchParams);
    };

    const currentSortField = searchParams.get('sort_field') || 'total_count';

    return (
        <>
            <Filter.Input registerName="name" placeholder="Name" />

            <Filter.InputDataList
                registerName="agent_id"
                placeholder="Agent"
                data={agentOptions}
                isLoading={isAgentLoading}
                isMulti
            />
            <Filter.InputSelect
                registerName="sort_field"
                placeholder="Sort by"
                options={countTypeOptions}
                onChange={handleSortFieldChange}
            />
            <Filter.InputSelect
                registerName={`sort_by_${currentSortField}`}
                placeholder="Sort Direction"
                options={sortOptions}
            />
        </>
    );
}

export default DeveloperFilter;
