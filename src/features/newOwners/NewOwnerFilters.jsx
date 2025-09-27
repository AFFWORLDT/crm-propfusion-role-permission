import Filter from "../../ui/Filter";

const defaultValues = {
    owner_name: "",
};

function NewOwnerFilters() {
  

    return (
        <Filter defaultValues={defaultValues}>
            <ExtraFilters
            />
        </Filter>
    );
}

function ExtraFilters() {
    return (
        <>
            <Filter.Input
                registerName="owner_name"
                placeholder="Search by owner name"
                type="text"
            />
            
        </>
    );
}

export default NewOwnerFilters;
