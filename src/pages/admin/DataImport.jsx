import DataImportContainer from "../../features/admin/dataImport/DataImportContainer";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";

function DataImport() {
  
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="DATA_IMPORT"
                    tabs={[
                        {
                            id: "DATA_IMPORT",
                            label: "Data Import",
                            bgColor: "#fff",
                            fontColor: "#000",
                            path: "/admin/data-import",
                        },
                    ]}
                />
            </SectionTop>
            <section 
                className="sectionStyles"
                style={{
                    backgroundColor: "#fff",
                    height: "100vh"
                }}
            >
                <div style={{backgroundColor: "#fff", boxShadow: "none"}}>
                    <DataImportContainer />
                </div>
            </section>
        </div>
    );
}

export default DataImport;
