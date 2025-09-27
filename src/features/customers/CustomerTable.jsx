import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import CustomerRow from "./CustomerRow";
import { useState } from "react";
import DeleteCustomer from "./DeleteCustomer";
import BulkAddLead from "./BulkAddLead";
import { Minus } from "lucide-react";

function CustomerTable({
    data,
    isLoading,
    ref,
    isFetchingNextPage,
    hasNextPage,
}) {
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState([
        "checkbox",
        "BuildingName",
        "OwnerName",
        "UnitNumber",
        "Rooms",
        "Nationality",
        "OwnerEmail",
        "ContactNumber",
        "ProcedureValue",
        "MasterLocation",
        "MasterProject",
        "PlotPreRegistration",
        "Size",
        "DMNumber",
        "DMSubNumber",
        "PropertyTypeEn",
        "LandNumber",
        "ProcedurePartyTypeName",
        "ProcedureName",
        "IDNumber",
        "PassportExpiryDate",
        "Birthdate",
        "Action"
    ]);

    // Base width per column in rem
    const baseColumnWidth = 18; // This gives us roughly 420rem for 23 columns (420/23 ≈ 18)
    
    // Calculate dynamic row width based on number of visible columns
    const getRowWidth = () => {
        const visibleNonCheckboxColumns = visibleColumns.filter(col => col !== 'checkbox');
        return `${visibleNonCheckboxColumns.length * baseColumnWidth}rem`;
    };

    const removeColumn = (columnId) => {
        setVisibleColumns(prev => {
            const newColumns = prev.filter(col => col !== columnId);
            // If all columns except checkbox are removed, remove checkbox too
            if (newColumns.length === 1 && newColumns[0] === 'checkbox') {
                return [];
            }
            return newColumns;
        });
    };

    if (isLoading) return <Spinner type="fullPage" />;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCustomers(data.map(customer => customer.customer_id));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectCustomer = (customerId) => {
        setSelectedCustomers(prev => {
            if (prev.includes(customerId)) {
                return prev.filter(id => id !== customerId);
            } else {
                return [...prev, customerId];
            }
        });
    };

    // Calculate dynamic grid template based on visible columns
    const getGridTemplate = () => {
        const columnWidths = {
            checkbox: "40px",
            BuildingName: "1.20fr",
            OwnerName: "2fr",
            UnitNumber: "1.20fr",
            Rooms: "1.20fr",
            Nationality: "1fr",
            OwnerEmail: "1fr",
            ContactNumber: "1fr",
            ProcedureValue: "1fr",
            MasterLocation: "1fr",
            MasterProject: "1fr",
            PlotPreRegistration: "1fr",
            Size: "1fr",
            DMNumber: "1fr",
            DMSubNumber: "1fr",
            PropertyTypeEn: "1fr",
            LandNumber: "1fr",
            ProcedurePartyTypeName: "1.20fr",
            ProcedureName: "1.30fr",
            IDNumber: "1.20fr",
            PassportExpiryDate: "1.20fr",
            Birthdate: "1.20fr",
            Action: "1fr"
        };

        return visibleColumns.map(col => columnWidths[col]).join(" ");
    };

    const HeaderCell = ({ columnId, children }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {children}
            {columnId !== 'checkbox' && (
                <Minus
                    size={16}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        removeColumn(columnId);
                    }}
                />
            )}
        </div>
    );

    // Show message when no columns are visible
    if (visibleColumns.length === 0) {
        return (
            <div style={{ 
                padding: "2rem", 
                textAlign: "center", 
                color: "#666",
                fontSize: "1.8rem"
            }}>
                All columns have been removed. Refresh the page to restore the table.
            </div>
        );
    }

    return (
        <div style={{ position: "relative" }}>
            {selectedCustomers.length > 0 && visibleColumns.length > 1 && (
                <div style={{ 
                    padding: "1rem", 
                    display: "flex", 
                    justifyContent: "flex-end",
                    gap: "1rem",
                    alignItems: "center"
                }}>
                    <span>{selectedCustomers.length} customers selected</span>
                    <DeleteCustomer
                        customerId={selectedCustomers}
                        isMultiple={true}
                        onDelete={() => setSelectedCustomers([])}
                    />
                    <BulkAddLead
                        selectedCustomerIds={selectedCustomers}
                        allCustomers={data}
                        onAdd={() => setSelectedCustomers([])}
                    />
                </div>
            )}
            <Table
                columns={getGridTemplate()}
                rowWidth={getRowWidth()}
                transparent={true}
                hasShadow={true}
                hasBorder={true}
            >
                <Table.Header>
                    {visibleColumns.includes('checkbox') && visibleColumns.length > 1 && (
                        <HeaderCell columnId="checkbox">
                            <input
                                type="checkbox"
                                checked={selectedCustomers.length === data.length}
                                onChange={handleSelectAll}
                            />
                        </HeaderCell>
                    )}
                    {visibleColumns.includes('BuildingName') && (
                        <HeaderCell columnId="BuildingName">Building Name</HeaderCell>
                    )}
                    {visibleColumns.includes('OwnerName') && (
                        <HeaderCell columnId="OwnerName">Owner Name</HeaderCell>
                    )}
                    {visibleColumns.includes('UnitNumber') && (
                        <HeaderCell columnId="UnitNumber">Unit Number</HeaderCell>
                    )}
                    {visibleColumns.includes('Rooms') && (
                        <HeaderCell columnId="Rooms">Rooms</HeaderCell>
                    )}
                    {visibleColumns.includes('Nationality') && (
                        <HeaderCell columnId="Nationality">Nationality</HeaderCell>
                    )}
                    {visibleColumns.includes('OwnerEmail') && (
                        <HeaderCell columnId="OwnerEmail">Owner Email</HeaderCell>
                    )}
                    {visibleColumns.includes('ContactNumber') && (
                        <HeaderCell columnId="ContactNumber">Contact Number</HeaderCell>
                    )}
                    {visibleColumns.includes('ProcedureValue') && (
                        <HeaderCell columnId="ProcedureValue">Procedure Value</HeaderCell>
                    )}
                    {visibleColumns.includes('MasterLocation') && (
                        <HeaderCell columnId="MasterLocation">Master Location</HeaderCell>
                    )}
                    {visibleColumns.includes('MasterProject') && (
                        <HeaderCell columnId="MasterProject">Master Project</HeaderCell>
                    )}
                    {visibleColumns.includes('PlotPreRegistration') && (
                        <HeaderCell columnId="PlotPreRegistration">Plot Pre-Registration</HeaderCell>
                    )}
                    {visibleColumns.includes('Size') && (
                        <HeaderCell columnId="Size">Size</HeaderCell>
                    )}
                    {visibleColumns.includes('DMNumber') && (
                        <HeaderCell columnId="DMNumber">DM Number</HeaderCell>
                    )}
                    {visibleColumns.includes('DMSubNumber') && (
                        <HeaderCell columnId="DMSubNumber">DM Sub Number</HeaderCell>
                    )}
                    {visibleColumns.includes('PropertyTypeEn') && (
                        <HeaderCell columnId="PropertyTypeEn">Property Type En</HeaderCell>
                    )}
                    {visibleColumns.includes('LandNumber') && (
                        <HeaderCell columnId="LandNumber">Land Number</HeaderCell>
                    )}
                    {visibleColumns.includes('ProcedurePartyTypeName') && (
                        <HeaderCell columnId="ProcedurePartyTypeName">Procedure Party Type Name En</HeaderCell>
                    )}
                    {visibleColumns.includes('ProcedureName') && (
                        <HeaderCell columnId="ProcedureName">Procedure Name</HeaderCell>
                    )}
                    {visibleColumns.includes('IDNumber') && (
                        <HeaderCell columnId="IDNumber">ID Number (UAI ID Number)</HeaderCell>
                    )}
                    {visibleColumns.includes('PassportExpiryDate') && (
                        <HeaderCell columnId="PassportExpiryDate">Passport Expiry Date</HeaderCell>
                    )}
                    {visibleColumns.includes('Birthdate') && (
                        <HeaderCell columnId="Birthdate">Birthdate</HeaderCell>
                    )}
                    {visibleColumns.includes('Action') && (
                        <HeaderCell columnId="Action">Action</HeaderCell>
                    )}
                </Table.Header>
                <Table.Body
                    data={data}
                    render={(customerObj) => (
                        <CustomerRow
                            customerData={{
                                BuildingNameEn: customerObj["BuildingNameEn"],
                                OwnerNAME: customerObj.OwnerNAME,
                                UnitNumber: customerObj.UnitNumber || "N/A",
                                Rooms: customerObj.Rooms || "N/A",
                                Nationality: customerObj.Nationality || "N/A",
                                Email: customerObj?.Email || "N/A",
                                "Contact number": customerObj.Mobile || "N/A",
                                agent: { name: customerObj.OwnerNAME },
                                area: { name: customerObj["Master location"] },
                                customer_id: customerObj.customer_id,
                                ProcedureValue: customerObj.ProcedureValue,
                                MasterLocation: customerObj["Master location"],
                                MasterProject: customerObj["Master project"],
                                PlotPreRegistration: customerObj["Plot Pre Reg No"],
                                DMNumber: customerObj["DM Number"],
                                DMSubNumber: customerObj["DmSubNo"],
                                PropertyTypeEn: customerObj["PropertyTypeEn"],
                                LandNumber: customerObj["Land Number"],
                                ProcedurePartyTypeName: customerObj["ProcedurePartyTypeNameEn"],
                                ProcedureNameEn: customerObj["ProcedureNameEn"],
                                UaeIdNumber: customerObj["UaeIdNumber"],
                                PassportExpiryDate: customerObj["PassportExpiryDate"],
                                BirthDate: customerObj["BirthDate"],
                            }}
                            key={customerObj?._id}
                            visibleColumns={visibleColumns}
                            isSelected={selectedCustomers.includes(customerObj.customer_id)}
                            onSelect={() => handleSelectCustomer(customerObj.customer_id)}
                        />
                    )}
                />
            </Table>
            <div
                ref={ref}
                style={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1rem",
                }}
            >
                {isFetchingNextPage && <Spinner type="small" />}
                {!hasNextPage && data.length > 0 && (
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                        No more customers to load
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerTable;
