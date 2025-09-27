import "react-datepicker/dist/react-datepicker.css";
import Filter from "../../ui/Filter";
import { usePropertiesBasics } from "../properties/usePropertiesBasics";
import { useSimplifiedTenantLists } from "../../pages/Tenents/useSimplifiedTenantLists";
import useBuildings from "../buildings/useBuildings";

const defaultValues = {
    payment_status: "",
    property_id: "",
    tenant_id: "",
    building_id: "",
    house_no: "",
    dateSortType: "DESC",
    overdue: false,
};
function RentalAgreementFilter() {
    const { properties, isLoading: isPropertiesLoading } =
        usePropertiesBasics(true);
    const propertyOptions = properties.map((property) => ({
        label: property?.title,
        value: property?.id,
    }));
    const { tenants, isLoading: isTenantsLoading } =
        useSimplifiedTenantLists(true);
    const tenantOptions = tenants.map((tenant) => ({
        label: tenant?.tenant_name,
        value: tenant?.id,
    }));

    const { buildings: buildingOptions, isLoading: isBuildingsLoading } =
        useBuildings(true);

    return (
        <Filter efaultValues={defaultValues}>
            <Filter.InputDataList
                registerName="property_id"
                placeholder="Select Property"
                data={propertyOptions}
                isLoading={isPropertiesLoading}
            />
            <Filter.InputDataList
                registerName="tenant_id"
                placeholder="Select Tenant"
                data={tenantOptions}
                isLoading={isTenantsLoading}
            />

            <Filter.InputDataList
                registerName="building_id"
                placeholder="Select Building "
                data={buildingOptions}
                isLoading={isBuildingsLoading}
            />
            <Filter.Input
                registerName="house_no"
                placeholder="Unit/House Number"
            />

            <Filter.InputSelect
                registerName="payment_status"
                placeholder="Payment Status"
                options={[
                    {
                        label: "Pending",
                        value: "pending",
                    },
                    {
                        label: "Done",
                        value: "done",
                    },
                ]}
            />

            <Filter.Input
                registerName="days_until_due"
                placeholder="Days Until Due"
                type="number"
            />

            <Filter.InputSelect
                registerName="dateSortType"
                placeholder="Sort Order"
                options={[
                    {
                        label: "Descending",
                        value: "DESC",
                    },
                    {
                        label: "Ascending",
                        value: "ASC",
                    },
                ]}
            />
            <Filter.InputSelect
                registerName="overdue"
                placeholder="Overdue Payment"
                options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                ]}
            />
        </Filter>
    );
}

export default RentalAgreementFilter;
