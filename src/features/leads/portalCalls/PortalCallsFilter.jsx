import "react-datepicker/dist/react-datepicker.css";
import Filter from "../../../ui/Filter";
import useBrowserWidth from "../../../hooks/useBrowserWidth";
import Modal from "../../../ui/Modal";

function PortalCallsFilter() {
    const browserWidth = useBrowserWidth();

    return (
        <Filter>
            <Filter.Input registerName="property_id" placeholder="Property Id" />
            {browserWidth > 480 ? (
                <ExtraFilters />
            ) : (
                <Modal>
                    <Modal.Open openWindowName="propertyFilterModal">
                        <button className="btnExtraFilters">
                            <img src="/icons/filter.svg" alt="" />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="propertyFilterModal">
                        <div className="filterModalContainer">
                            <ExtraFilters />
                        </div>
                    </Modal.Window>
                </Modal>
            )}
        </Filter>
    );
}

function ExtraFilters() {
    return (
        <>
            <Filter.InputDatePicker
                registerName="date_from"
                placeholder="Start date"
            />
            <Filter.InputDatePicker
                registerName="date_to"
                placeholder="End date"
            />
            <Filter.Input registerName="caller_number" placeholder="Caller Number" />
            <Filter.InputSelect registerName="call_status" placeholder={"Call Type "} options={[{
                label: "Select call type",
                value: "",
            },
                {
                label: "Missed",
                value: "missed"
            }, {
                label: "Connected ",
                value: "connected"
            }, {
                label: "Not Connected",
                value: "notconnected"

            },
            {
                label: "Voicemail",
                value: "voicemail"
            },]} />
            <Filter.InputSelect registerName="sort_order" placeholder="Sort Order " options={[{
                label: "Select sort order",
                value: "",
            },
                 {
                    label: "Descending",
                    value: "DESC"
                },
                {
                label: "Ascending",
                value: "ASC"
            },]} />

        </>
    );
}

export default PortalCallsFilter;
