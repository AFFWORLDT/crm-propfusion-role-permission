import KpiForm from "./kpiForm.jsx";
import Modal from "../../ui/Modal";
import useAllDetails from "../all-details/useAllDetails.js";

function AddKpi() {
    const { data } = useAllDetails();

    return (
        <div>
            <Modal>
                <Modal.Open openWindowName="kpi-form">
                    <Modal.Open openWindowName="kpi-form">
                        <button
                            style={{
                                background:
                                    data?.company_settings
                                        ?.sidebar_color_code || "#020079",
                                color: "white",
                                padding: "0.6rem 1rem",   
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                             Add KPI
                        </button>
                    </Modal.Open>
                </Modal.Open>
                <Modal.Window name="kpi-form" overflow={"auto"}>
                    <KpiForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default AddKpi;
