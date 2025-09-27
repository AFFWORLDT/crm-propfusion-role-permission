import Filter from "../../ui/Filter";
import { BODY_TYPES } from "../../utils/constants";

const defaultValues = {
    brand: "",
    model: "",
    year: "",
    start_date: "",
    end_date: "",
    body_type: "",
    inspector_id: "",
    customer_id: "",
};

function VehiclesFilter() {
    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters />
        </Filter>
    );
}

function ExtraFilters() {
    return (
        <>
            <Filter.Input registerName="brand" placeholder="Brand" />
            <Filter.Input registerName="model" placeholder="Model" />
            <Filter.Input
                registerName="year"
                placeholder="Year"
                type="number"
            />
            <Filter.InputDatePicker
                registerName="start_date"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="end_date"
                placeholder="End date"
            />
            <Filter.InputDataList
                registerName="body_type"
                placeholder="Body Type"
                data={BODY_TYPES}
            />
            <Filter.Input
                registerName="inspector_id"
                placeholder="Inspector ID"
                type="number"
            />
            <Filter.Input
                registerName="customer_id"
                placeholder="Customer ID"
                type="number"
            />
        </>
    );
}

export default VehiclesFilter;
