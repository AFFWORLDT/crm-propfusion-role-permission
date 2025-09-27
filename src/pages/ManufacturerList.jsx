import { Search } from "lucide-react"
import SectionTop from "../ui/SectionTop"
import ToggleButton from "../ui/ToggleButton"
import { useRef } from "react"
import { useSearchParams } from "react-router-dom"
import AreaFilter from "../features/areas/AreaFilter"
import ViewToggleButton from "../ui/ViewToggleButton"
import { LayoutGrid, LayoutList } from "lucide-react"
import ManufacturerGrid from "../features/manufacturer/manufacturerGrid"
import ManufacturerTable from "../features/manufacturer/ManufacturerTable"
function ManufacturerList() {
    const containerRef = useRef(null);
    const [searchParams] = useSearchParams();
    const viewType = searchParams.get("viewType") ?? "grid";
    const viewOptions = [
        { value: "grid", label: "Grid View", icon: <LayoutGrid size={20} /> },
        { value: "table", label: "Table View", icon: <LayoutList size={20} /> },
    ];
    return (
        <div className="sectionContainer">
            <SectionTop heading="Manufacturers List"/>

            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    height: "calc(100vh)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style>
                    {`
                        .sectionStyles::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <div>
                    <ToggleButton>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "1rem",
                                marginBottom: "1rem",
                                paddingTop: "4rem",
                            }}
                        >
                            <div></div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                <ToggleButton.Button
                                    label="Advanced Filter"
                                    icon={<Search />}
                                    style={{
                                        "--toggleBtn-primary": "#000",
                                        border: "1px solid #000",
                                        backgroundColor: "transparent",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.5rem",
                                        color: "#000",
                                    }}
                                />
                                 <ViewToggleButton
                                    defaultView="interactive"
                                    viewParamName="viewType"
                                    viewOptions={viewOptions}
                                />
                            </div>
                        </div>
                        <ToggleButton.Content>
                            <div
                                className="LEADSfilter"
                                style={{
                                    padding: "1.5rem",
                                    borderTop: "1px solid #eee",
                                    backgroundColor: "transparent !important",
                                }}
                            >
                                <AreaFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "grid" && <ManufacturerGrid containerRef={containerRef} />}
                    {viewType === "table" && <ManufacturerTable containerRef={containerRef} />}
                </div>
            </section>
        </div>
    );
}

export default ManufacturerList
