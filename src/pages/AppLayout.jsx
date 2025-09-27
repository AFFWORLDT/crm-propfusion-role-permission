import { Outlet, useNavigate } from "react-router-dom";
import styles from "./AppLayout.module.css";
import CustomSideNav from "../ui/CustomSideNav";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import useAllDetails from "../features/all-details/useAllDetails";

function AppLayout() {
    const { data, isLoading } = useAllDetails();
    const [isGuideOpen, setGuideOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.company_settings?.first_time) {
            navigate("/onboarding");
        }
    }, [data, navigate]);

    return (
        <main className={styles.app}>
            {/* <SideNav /> */}
            <CustomSideNav />

            <Outlet />

            {!isLoading &&
                !data?.company_settings?.company_name &&
                createPortal(
                    <div
                        className={[
                            styles.guideSteps,
                            isGuideOpen ? styles.guideActive : "",
                        ].join(" ")}
                    >
                        <div className={styles.guideToggle}>
                            <span>
                                Please follow these steps to set up your portal
                            </span>
                            <button
                                onClick={() =>
                                    setGuideOpen((current) => !current)
                                }
                                className={styles.btnToggle}
                            >
                                <img src="/icons/chevron-down.svg" />
                            </button>
                        </div>
                        <div className={styles.guideContent}>
                            <ul>
                                <li>General - Update your company info.</li>
                                <li>
                                    Go to the admin panel (Profile) to update
                                    all your details.
                                </li>
                                <li>
                                    Go to DataImport (Here you can import your
                                    areas or developers).
                                </li>
                                <li>
                                    Once it is done, your portal is activated.
                                </li>
                                <li>Create your team.</li>
                                <li>Add your staff.</li>
                            </ul>
                            <p>😊 Thank you for choosing Propfusion!</p>
                        </div>
                    </div>,
                    document.body
                )}
        </main>
    );
}

export default AppLayout;
