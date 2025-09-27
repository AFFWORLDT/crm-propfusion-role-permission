import SectionTop from "../../ui/SectionTop";
import Filter from "../../ui/Filter";
import { MANAGE_AREAS_TABS } from "../../utils/constants";
import ManageManufacturersGrid from "../../features/manufacturer/ManageManufacturersGrid";
import AddManufacturer from "../../features/manufacturer/AddManufacturer";

function ManageManufacturers() {
    return (
        <div className="sectionContainer">
            <SectionTop heading="Manage Manufacturers">
               
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: MANAGE_AREAS_TABS[0].bgColor }}>
                <div className="sectionDiv">
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "2rem",
                    }}>
                        <Filter >
                            <Filter.Input registerName="name" placeholder="Name" />
                        </Filter>
                        <AddManufacturer />
                    </div>
                    <ManageManufacturersGrid />
                </div>
            </section>
        </div>
    );
}

export default ManageManufacturers;
