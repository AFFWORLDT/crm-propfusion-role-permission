import { useMyPermissions } from "../../hooks/useHasPermission";
import Table from "../../ui/Table";
import AddLead from "./AddLead";
import DeleteCustomer from "./DeleteCustomer";
import EditCustomerButton from "./EditCustomerButton";

function CustomerRow({ customerData, isSelected, onSelect, visibleColumns }) {
    const { hasPermission } = useMyPermissions();

    const {
        BuildingNameEn,
        UnitNumber,
        OwnerNAME,
        Rooms,
        Nationality,
        Email,
        "Contact number": contact_number,
        customer_id,
        ProcedureValue,
        MasterLocation,
        MasterProject,
        PlotPreRegistration,
        Size,
        DMNumber,
        DMSubNumber,
        PropertyTypeEn,
        LandNumber,
        ProcedurePartyTypeName,
        ProcedureNameEn,
        UaeIdNumber,
        PassportExpiryDate,
        BirthDate,
    } = customerData;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Table.Row>
            {visibleColumns.includes('checkbox') && (
                <div>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onSelect}
                    />
                </div>
            )}
            {visibleColumns.includes('BuildingName') && (
                <div>{BuildingNameEn || "N/A"}</div>
            )}
            {visibleColumns.includes('OwnerName') && (
                <div>{OwnerNAME || "N/A"}</div>
            )}
            {visibleColumns.includes('UnitNumber') && (
                <div>{UnitNumber || "N/A"}</div>
            )}
            {visibleColumns.includes('Rooms') && (
                <div>{Rooms || "N/A"}</div>
            )}
            {visibleColumns.includes('Nationality') && (
                <div>{Nationality || "N/A"}</div>
            )}
            {visibleColumns.includes('OwnerEmail') && (
                <div>{Email || "N/A"}</div>
            )}
            {visibleColumns.includes('ContactNumber') && (
                <div>{contact_number || "N/A"}</div>
            )}
            {visibleColumns.includes('ProcedureValue') && (
                <div>{ProcedureValue || "N/A"}</div>
            )}
            {visibleColumns.includes('MasterLocation') && (
                <div>{MasterLocation || "N/A"}</div>
            )}
            {visibleColumns.includes('MasterProject') && (
                <div>{MasterProject || "N/A"}</div>
            )}
            {visibleColumns.includes('PlotPreRegistration') && (
                <div>{PlotPreRegistration || "N/A"}</div>
            )}
            {visibleColumns.includes('Size') && (
                <div>{Size || "N/A"}</div>
            )}
            {visibleColumns.includes('DMNumber') && (
                <div>{DMNumber || "N/A"}</div>
            )}
            {visibleColumns.includes('DMSubNumber') && (
                <div>{DMSubNumber || "N/A"}</div>
            )}
            {visibleColumns.includes('PropertyTypeEn') && (
                <div>{PropertyTypeEn || "N/A"}</div>
            )}
            {visibleColumns.includes('LandNumber') && (
                <div>{LandNumber || "N/A"}</div>
            )}
            {visibleColumns.includes('ProcedurePartyTypeName') && (
                <div>{ProcedurePartyTypeName || "N/A"}</div>
            )}
            {visibleColumns.includes('ProcedureName') && (
                <div>{ProcedureNameEn || "N/A"}</div>
            )}
            {visibleColumns.includes('IDNumber') && (
                <div>{UaeIdNumber || "N/A"}</div>
            )}
            {visibleColumns.includes('PassportExpiryDate') && (
                <div>{formatDate(PassportExpiryDate)}</div>
            )}
            {visibleColumns.includes('Birthdate') && (
                <div>{formatDate(BirthDate)}</div>
            )}
            {visibleColumns.includes('Action') && (
                <div style={{ display: "flex", gap: "12px" }}>
                    <EditCustomerButton
                        customerId={customer_id}
                        customerData={customerData}
                    />
                    {!isSelected && (
                        <DeleteCustomer
                            customerId={customer_id}
                            customerName={OwnerNAME}
                        />
                    )}
                    <AddLead
                        data={customerData}
                    />
                </div>
            )}
        </Table.Row>
    );
}

export default CustomerRow;
