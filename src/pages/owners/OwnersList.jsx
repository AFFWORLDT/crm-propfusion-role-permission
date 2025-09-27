import useInfiniteOwners from "../../features/Owner/useInfiniteOwners";
import NewOwner from "../../features/Owner/NewOwner";
import { useState } from "react";
import toast from "react-hot-toast";

function OwnersList() {
    const {
        owners,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteOwners();

    const [selectedOwner, setSelectedOwner] = useState(null);

    const handleEdit = (owner) => {
        setSelectedOwner(owner);
        // Add your edit logic here
    };

    const handelDelete = (owner) => {
        // Add your delete logic here
        toast.error("Delete functionality not implemented yet");
    };

    const onAddOwner = () => {
        // Add your add owner logic here
        toast.error("Add owner functionality not implemented yet");
    };

    return (
        <div className="sectionContainer">
            <NewOwner
                isLoading={isLoading}
                data={owners}
                error={error}
                totalSize={totalSize}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                handelDelete={handelDelete}
                handleEdit={handleEdit}
                onAddOwner={onAddOwner}
            />
        </div>
    );
}

export default OwnersList; 