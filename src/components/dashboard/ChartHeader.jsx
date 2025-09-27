import styles from "../../pages/Dashboard.module.css";

function ChartHeader({ title,  }) {
    // Only render CSVLink if csvData is valid (an array with items)

    return (
        <div className={styles.chartHeader}  >
            <h1 className={styles.dashboardForPropertyReportHeader} >
                {title}
            </h1>
        </div>
    );
}

export default ChartHeader; 