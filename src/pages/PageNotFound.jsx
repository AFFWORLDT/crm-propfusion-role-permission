import { useNavigate } from "react-router-dom";
import styles from "./PageNotFound.module.css";

function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className={styles.pageNotFound}>
            <div className={styles.pageNotFoundContainer}>
                <p>The page you are looking for could not be found 😢</p>
                <button onClick={() => navigate("/")}>← Go back</button>
            </div>
        </div>
    );
}

export default PageNotFound;
