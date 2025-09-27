import Table from "../../../ui/Table";
import Spinner from "../../../ui/Spinner";
import BayutLeadRow from "./BayutLeadRow";
function BayutLeadsTable({ data, isLoading }) {
    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <Table
            columns="1fr 1fr 1fr 1fr 1.25fr 2.5fr  1fr 2.2fr"
            rowWidth="165rem"
        >
            <Table.Header>
                <div>Id</div>
                <div>Status</div>
                <div>Caller</div>
                <div>Receiver</div>
                <div>Call Duration</div>
                <div>Call Recording</div>
                <div>Call Time</div>
                <div>Operations</div>
            </Table.Header>
            <Table.Body
                data={data}
                render={(BayutLeadObject) => (
                    <BayutLeadRow
                        bayutLeadData={BayutLeadObject}
                        key={BayutLeadObject.call_log_id}
                    />
                )}
            />

        </Table>
    );
}

export default BayutLeadsTable;
