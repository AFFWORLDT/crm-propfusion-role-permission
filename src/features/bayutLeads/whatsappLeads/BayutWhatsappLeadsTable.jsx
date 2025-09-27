import Table from "../../../ui/Table";
import Spinner from "../../../ui/Spinner";
import BayutWhatsLeadsRow from "./BayutWhatsLeadsRow";
function BayutWhatsappLeadsTable({ data, isLoading }) {
    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <Table
            columns="1fr  1fr  1fr 1fr  1fr 1.5fr 1fr   "
            rowWidth="250rem"
        >
            <Table.Header>
                <div>Date</div>
                <div>Listing ID</div>
                <div>Listing Reference</div>
                <div>Actor Name</div>
                <div>Cell</div>
                <div>Message</div>
                <div>Operations</div>
            </Table.Header>
            <Table.Body
                data={data}
                render={(Object) => (
                    <BayutWhatsLeadsRow
                        beyutLeadWhatsappData={Object}
                        key={Object?.date_time}
                    />
                )}
            />

        </Table>
    )
}

export default BayutWhatsappLeadsTable
