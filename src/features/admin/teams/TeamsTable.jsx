import { useEffect } from "react";
import useTeams from "./useTeams";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import TeamRow from "./TeamRow";

function TeamsTable() {
    const { isLoading, data, error } = useTeams();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <Table
            columns="1fr 1.5fr 2fr"
            rowWidth="60rem"
            hasBorder={true}
            hasShadow={true}
            transparent={false}
        >
            <Table.Header>
                <div>Name</div>
                <div style={{ textAlign: "center" }}>Members Count</div>
                <div>Actions</div>
            </Table.Header>
            <Table.Body
                data={data}
                render={(teamObj) => (
                    <TeamRow teamData={teamObj} key={teamObj.team_id} />
                )}
            />
        </Table>
    );
}

export default TeamsTable;
