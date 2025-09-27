import SectionTop from "../../ui/SectionTop";
import Properties from "../../features/properties/Properties";
import PropertiesFilter from "../../features/properties/PropertiesFilter";
import ExtraFilters from "../../ui/ExtraFilters";
import useProperties from "../../features/properties/useProperties";

function PropertiesList({ listingType }) {
    const { isLoading, data, totalSize, error } = useProperties(listingType);

    return (
        <div className="sectionContainer">
            <SectionTop
                heading={`${listingType[0] + listingType.toLowerCase().slice(1)} List`}
            />
            <section className="sectionStyles">
                <div className="sectionDiv">
                    <PropertiesFilter />
                    <ExtraFilters
                        buttonOptions={[
                            { label: "Active", value: "ACTIVE" },
                        { label: "Inactive", value: "INACTIVE" },
                        ]}
                        totalSize={totalSize}
                    />
                    <Properties
                        listingType={listingType}
                        isLoading={isLoading}
                        error={error}
                        data={data}
                        totalSize={totalSize}
                    />
                </div>
            </section>
        </div>
    );
}

export default PropertiesList;
