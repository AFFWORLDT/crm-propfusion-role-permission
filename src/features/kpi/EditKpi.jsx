import KpiForm from "./kpiForm.jsx";
import Modal from "../../ui/Modal";

function EditKpi({ data, children }) {
    return (
        <div>
            <Modal>
                <Modal.Open openWindowName="kpi-form">{children}</Modal.Open>
                <Modal.Window name="kpi-form" overflow={true}>
                    <KpiForm kpiToEdit={data} />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default EditKpi;
