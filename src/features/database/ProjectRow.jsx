import { EyeIcon } from "lucide-react";
import Table from "../../ui/Table";
import DeleteProject from "./DeleteProject";
import { useNavigate } from "react-router-dom";
import { useMyPermissions } from "../../hooks/useHasPermission";

const commonButtonStyles = {
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: "800",
    transition: "all 0.2s ease",
};

function ProjectRow({ projectData }) {
    const { hasPermission } = useMyPermissions();

    const { name, _id } = projectData;

    const navigate = useNavigate();

    return (
        <Table.Row>
            <div>{name || "Database Name"}</div>
            <div style={{ display: "flex", gap: "12px" }}>
                <button
                    style={{
                        ...commonButtonStyles,
                        border: "0.1px dashed #001535",
                        color: "#00050e",
                    }}
                    onClick={() => {
                        navigate(
                            `/database/list/customers?database_name_id=${_id}`
                        );
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#e8f1ff";
                        e.target.style.color = "#00050e";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#00050e";
                    }}
                >
                    <EyeIcon size={20} /> Details
                </button>
                {hasPermission("delete_projects") && <DeleteProject id={_id} />}
            </div>
        </Table.Row>
    );
}

export default ProjectRow;
