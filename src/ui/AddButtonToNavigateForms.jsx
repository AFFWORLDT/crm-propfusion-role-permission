import { useNavigate } from "react-router-dom";
import useImagesStore from "../store/imagesStore";
import useAllDetails from "../features/all-details/useAllDetails";
import { useDocumentsStore } from "../store/imagesStore";
import styles from "../styles/AddButtonToNavigateForms.module.css";

function AddButtonToNavigateForms() {
    const { data } = useAllDetails();

    const navigate = useNavigate();
    const { clearAllImages } = useImagesStore();
    const { clearAllDocuments } = useDocumentsStore();
    const path = location.pathname.includes("for-sell/new-list")
        ? "/for-sell"
        : location.pathname.includes("new-projects")
          ? "/new-projects"
          : location.pathname.includes("for-rent/new-list")
            ? "/for-rent"
            : location.pathname.includes("new-building")
              ? "/new-building"
              : location.pathname.includes("vehicles/for-sell")
                ? "/vehicles/for-sell"
                : location.pathname.includes("vehicles/for-rent")
                  ? "/vehicles/for-rent"
                  : "/leads";

    const handleNavigate = () => {
        clearAllDocuments();
        clearAllImages();
        navigate(`${path}/add`);
        localStorage.removeItem("documents-storage");
        localStorage.removeItem("single-image-storage");
    };

    return (
        <div style={{ marginRight: "1rem" }}>
            <button
                type="button"
                onClick={handleNavigate}
                style={{
                    backgroundColor:
                        data?.company_settings?.sidebar_color_code || "#020079",
                    border: "1px solid #000",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    color: "#fff",
                    padding: "0.7rem 1rem",
                    width: "100%"
                }}
                className={`btnNormalSmall ${styles.addButtonResponsive}`}
            >
                <span>+</span>
                <span>
                    Add{" "}
                    {path === "/for-sell" || path === "/for-rent"
                        ? "Property"
                        : path === "/new-projects"
                          ? "Project"
                          : path === "/new-building"
                            ? "Building"
                            : path === "/vehicles/for-sell"
                              ? "Vehicle"
                              : path === "/vehicles/for-rent"
                                ? "Vehicle"
                                : "Lead"}
                </span>
            </button>
        </div>
    );
}

export default AddButtonToNavigateForms;
