import { useEffect } from "react";
import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import StaffRow from "./StaffRow";
import useStaff from "./useStaff";
import toast from "react-hot-toast";

function StaffTable() {
    const { isLoading, data, error } = useStaff();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <Table columns=".1fr .15fr .15fr .1fr .5fr" rowWidth="86rem">
            <Table.Header>
                <div>Profile</div>
                <div>Name</div>
                <div>Phone</div>  
                <div>State</div>
                <div>Actions</div>
            </Table.Header>  
            <Table.Body     
                data={data}
                render={(staffObj) => (   
                    <StaffRow staffData={staffObj} key={staffObj.id} />   
                )}
            />  
        </Table>
    );
}

export default StaffTable;
