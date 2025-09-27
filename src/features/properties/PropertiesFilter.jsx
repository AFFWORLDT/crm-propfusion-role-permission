import { BEDROOM_NUM_OPTIONS, PROPERTY_TYPES } from "../../utils/constants";
import Filter from "../../ui/Filter";
import Modal from "../../ui/Modal";
import useBrowserWidth from "../../hooks/useBrowserWidth";
import useDevelopersWithoutCount from "../developers/useDevelopersWithoutCount";

function PropertiesFilter() {
    const browserWidth = useBrowserWidth();
    const { isLoading: isDeveloperLoading, data: developerData } =
        useDevelopersWithoutCount(true);

    const developerOptions = developerData.map((data) => {
        return {
            value: data.id,
            label: data.name,
        };
    });

    return (
        <Filter>
            <Filter.Input registerName="name" placeholder="Name" />
            {browserWidth > 480 ? (
                <ExtraFilters
                    developerOptions={developerOptions}
                    isDeveloperLoading={isDeveloperLoading}
                />
            ) : (
                <Modal>
                    <Modal.Open openWindowName="propertyFilterModal">
                        <button className="btnExtraFilters">
                            <img src="/icons/filter.svg" alt="" />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="propertyFilterModal">
                        <div className="filterModalContainer">
                            <ExtraFilters
                                developerOptions={developerOptions}
                                isDeveloperLoading={isDeveloperLoading}
                            />
                        </div>
                    </Modal.Window>
                </Modal>
            )}
        </Filter>
    );
}

function ExtraFilters({ developerOptions, isDeveloperLoading }) {
    return (
        <>
            <Filter.InputDatePicker
                registerName="dateStart"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="dateEnd"
                placeholder="End date"
            />
            <Filter.Input registerName="propertyId" placeholder="Property ID" />
            <Filter.InputSelect
                registerName="propertyType"
                options={PROPERTY_TYPES}
            />
            <Filter.InputDataList
                registerName="developerIds"
                placeholder="Developer"
                data={developerOptions}
                isLoading={isDeveloperLoading}
            />
            <Filter.InputSelect
                registerName="bedRoomNum"
                options={BEDROOM_NUM_OPTIONS}
            />
        </>
    );
}

export default PropertiesFilter;
